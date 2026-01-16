<template>
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="d-flex justify-content-between align-items-center">
                <h1 class="h2 mb-0">Job #{{ jobId }}</h1>
                <button @click="goBack" class="btn btn-secondary btn-sm">Back</button>
            </div>
        </div>
    </div>

    <div v-if="loading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <div v-else-if="!job" class="alert alert-danger">
        Job not found
    </div>

    <div v-else class="row">
        <!-- Basic Information -->
        <div class="col-md-6 mb-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Job Information</h5>
                </div>
                <div class="card-body">
                    <dl class="row">
                        <dt class="col-sm-4">Job Class:</dt>
                        <dd class="col-sm-8 text-truncate" :title="job.job_class">{{ job.job_class }}</dd>

                        <dt class="col-sm-4">Queue:</dt>
                        <dd class="col-sm-8">{{ job.queue }}</dd>

                        <dt class="col-sm-4">Connection:</dt>
                        <dd class="col-sm-8">{{ job.connection }}</dd>

                        <dt class="col-sm-4">Status:</dt>
                        <dd class="col-sm-8">
                            <span :class="statusBadgeClass(job.status)" class="badge">{{ job.status }}</span>
                        </dd>

                        <dt class="col-sm-4">UUID:</dt>
                        <dd class="col-sm-8 text-truncate" :title="job.uuid">{{ job.uuid }}</dd>
                    </dl>
                </div>
            </div>
        </div>

        <!-- Timing Information -->
        <div class="col-md-6 mb-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Timing</h5>
                </div>
                <div class="card-body">
                    <dl class="row">
                        <dt class="col-sm-4">Started At:</dt>
                        <dd class="col-sm-8">{{ formatDate(job.started_at) }}</dd>

                        <dt class="col-sm-4">Finished At:</dt>
                        <dd class="col-sm-8">{{ formatDate(job.finished_at) }}</dd>

                        <dt class="col-sm-4">Duration:</dt>
                        <dd class="col-sm-8">{{ job.formatted_duration }}</dd>

                        <dt class="col-sm-4">Created At:</dt>
                        <dd class="col-sm-8">{{ formatDate(job.created_at) }}</dd>
                    </dl>
                </div>
            </div>
        </div>

        <!-- Tags -->
        <div v-if="job.job_tags && job.job_tags.length > 0" class="col-md-12 mb-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Tags</h5>
                </div>
                <div class="card-body">
                    <div class="d-flex flex-wrap gap-2">
                        <span v-for="tag in job.job_tags" :key="tag" class="badge bg-primary">
                            {{ tag }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Exception Details (if failed) -->
        <div v-if="job.status === 'failed' && job.exception_class" class="col-md-12 mb-4">
            <div class="card border-danger">
                <div class="card-header bg-danger text-white">
                    <h5 class="card-title mb-0">Exception</h5>
                </div>
                <div class="card-body">
                    <dl class="row">
                        <dt class="col-sm-3">Class:</dt>
                        <dd class="col-sm-9 text-truncate" :title="job.exception_class">{{ job.exception_class }}</dd>

                        <dt class="col-sm-3">Message:</dt>
                        <dd class="col-sm-9">{{ job.exception_message }}</dd>
                    </dl>

                    <div v-if="job.stack_trace" class="mt-3">
                        <h6>Stack Trace:</h6>
                        <pre class="bg-light p-3 rounded" style="max-height: 400px; overflow-y: auto;">{{ job.stack_trace }}</pre>
                    </div>

                    <button v-if="job.status === 'failed'" @click="retryJob" :disabled="retrying" class="btn btn-success mt-3">
                        <span v-if="retrying" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Retry Job
                    </button>
                </div>
            </div>
        </div>

        <!-- Payload -->
        <div v-if="job.payload" class="col-md-12 mb-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Payload</h5>
                </div>
                <div class="card-body">
                    <pre class="bg-light p-3 rounded" style="max-height: 400px; overflow-y: auto;">{{ formatJson(job.payload) }}</pre>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'JobDetail',
    data() {
        return {
            jobId: null,
            job: null,
            loading: false,
            retrying: false,
        };
    },
    methods: {
        async fetchJob() {
            this.loading = true;
            try {
                const response = await axios.get(`${window.Vantage.api_prefix}/jobs/${this.jobId}`);
                this.job = response.data;
            } catch (error) {
                console.error('Failed to fetch job:', error);
            } finally {
                this.loading = false;
            }
        },
        statusBadgeClass(status) {
            const classes = {
                processed: 'bg-success',
                failed: 'bg-danger',
                processing: 'bg-info',
            };
            return classes[status] || 'bg-secondary';
        },
        formatDate(date) {
            if (!date) return '-';
            return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },
        formatJson(data) {
            if (typeof data === 'string') {
                try {
                    return JSON.stringify(JSON.parse(data), null, 2);
                } catch {
                    return data;
                }
            }
            return JSON.stringify(data, null, 2);
        },
        async retryJob() {
            this.retrying = true;
            try {
                await axios.post(`${window.Vantage.api_prefix}/jobs/${this.jobId}/retry`);
                alert('Job retried successfully!');
                this.fetchJob(); // Refresh the job details
            } catch (error) {
                console.error('Failed to retry job:', error);
                alert('Failed to retry job: ' + (error.response?.data?.message || error.message));
            } finally {
                this.retrying = false;
            }
        },
        goBack() {
            this.$router.back();
        },
    },
    mounted() {
        this.jobId = this.$route.params.id;
        this.fetchJob();
    },
};
</script>
