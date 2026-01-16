<template>
    <div class="row mb-4">
        <div class="col-md-12">
            <h1 class="h2 mb-3">Failed Jobs</h1>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div v-if="loading && jobs.length === 0" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <div v-else-if="jobs.length === 0" class="text-muted text-center py-4">
                        No failed jobs
                    </div>
                    <div v-else class="table-responsive">
                        <table class="table table-sm table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Job</th>
                                    <th>Queue</th>
                                    <th>Exception</th>
                                    <th>Failed At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="job in jobs" :key="job.id">
                                    <td class="text-truncate" :title="job.job_class">{{ job.job_class }}</td>
                                    <td>{{ job.queue }}</td>
                                    <td class="text-truncate" :title="job.exception_class">
                                        <span class="badge bg-danger">{{ formatException(job.exception_class) }}</span>
                                    </td>
                                    <td>{{ formatDate(job.finished_at) }}</td>
                                    <td>
                                        <button @click="viewJob(job.id)" class="btn btn-link btn-sm me-2">
                                            View
                                        </button>
                                        <button @click="retryJob(job.id)" :disabled="retrying === job.id" class="btn btn-link btn-sm btn-success">
                                            <span v-if="retrying === job.id" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Retry
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Failed',
    data() {
        return {
            jobs: [],
            loading: false,
            retrying: null,
        };
    },
    methods: {
        async fetchJobs() {
            this.loading = true;
            try {
                const response = await axios.get(`${window.Vantage.api_prefix}/jobs`, {
                    params: {
                        status: 'failed',
                        limit: 100,
                    },
                });
                this.jobs = response.data.data;
            } catch (error) {
                console.error('Failed to fetch failed jobs:', error);
            } finally {
                this.loading = false;
            }
        },
        formatDate(date) {
            if (!date) return '-';
            return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },
        formatException(exceptionClass) {
            if (!exceptionClass) return 'Unknown';
            return exceptionClass.split('\\').pop();
        },
        viewJob(jobId) {
            this.$router.push(`/jobs/${jobId}`);
        },
        async retryJob(jobId) {
            this.retrying = jobId;
            try {
                await axios.post(`${window.Vantage.api_prefix}/jobs/${jobId}/retry`);
                // Remove the job from the list
                this.jobs = this.jobs.filter(job => job.id !== jobId);
                alert('Job retried successfully!');
            } catch (error) {
                console.error('Failed to retry job:', error);
                alert('Failed to retry job: ' + (error.response?.data?.message || error.message));
            } finally {
                this.retrying = null;
            }
        },
    },
    mounted() {
        this.fetchJobs();
    },
};
</script>
