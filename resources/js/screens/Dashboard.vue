<template>
    <div class="row mb-4">
        <div class="col-md-12">
            <h1 class="h2 mb-0">Dashboard</h1>
        </div>
    </div>

    <!-- Statistics Cards -->
    <div class="row">
        <div class="col-md-3 mb-4">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title text-muted mb-2">Total Jobs</h6>
                    <p class="h3 mb-0">{{ stats.total }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-4">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title text-muted mb-2">Processed</h6>
                    <p class="h3 mb-0 text-success">{{ stats.processed }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-4">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title text-muted mb-2">Failed</h6>
                    <p class="h3 mb-0 text-danger">{{ stats.failed }}</p>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-4">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title text-muted mb-2">Processing</h6>
                    <p class="h3 mb-0 text-info">{{ stats.processing }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Success Rate -->
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title text-muted mb-2">Success Rate</h6>
                    <p class="h4 mb-0">
                        <span :class="successRateClass">{{ stats.success_rate }}%</span>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Recent Jobs -->
    <div class="row">
        <div class="col-md-12 mb-4">
            <div class="card">
                <div class="card-header">
                    <h5 class="card-title mb-0">Recent Jobs</h5>
                </div>
                <div class="card-body">
                    <div v-if="loading" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <div v-else-if="recentJobs.length === 0" class="text-muted text-center py-4">
                        No jobs yet
                    </div>
                    <div v-else class="table-responsive">
                        <table class="table table-sm table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Job</th>
                                    <th>Status</th>
                                    <th>Queue</th>
                                    <th>Duration</th>
                                    <th>Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="job in recentJobs" :key="job.id" class="cursor-pointer" @click="viewJob(job.id)">
                                    <td class="text-truncate" :title="job.job_class">{{ job.job_class }}</td>
                                    <td>
                                        <span :class="statusBadgeClass(job.status)" class="badge">
                                            {{ job.status }}
                                        </span>
                                    </td>
                                    <td>{{ job.queue }}</td>
                                    <td>{{ job.formatted_duration }}</td>
                                    <td>{{ formatDate(job.created_at) }}</td>
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
    name: 'Dashboard',
    data() {
        return {
            stats: {
                total: 0,
                processed: 0,
                failed: 0,
                processing: 0,
                success_rate: 0,
            },
            recentJobs: [],
            loading: false,
        };
    },
    computed: {
        successRateClass() {
            const rate = this.stats.success_rate;
            if (rate >= 90) return 'text-success';
            if (rate >= 70) return 'text-warning';
            return 'text-danger';
        },
    },
    methods: {
        async fetchStatistics() {
            try {
                const response = await axios.get(`${window.Vantage.api_prefix}/statistics`);
                this.stats = response.data;
            } catch (error) {
                console.error('Failed to fetch statistics:', error);
            }
        },
        async fetchRecentJobs() {
            this.loading = true;
            try {
                const response = await axios.get(`${window.Vantage.api_prefix}/jobs`, {
                    params: {
                        limit: 20,
                        sort: '-created_at',
                    },
                });
                this.recentJobs = response.data.data;
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
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
            return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },
        viewJob(jobId) {
            this.$router.push(`/jobs/${jobId}`);
        },
    },
    mounted() {
        this.fetchStatistics();
        this.fetchRecentJobs();
        // Refresh statistics every 10 seconds
        this.statsInterval = setInterval(() => this.fetchStatistics(), 10000);
    },
    unmounted() {
        if (this.statsInterval) {
            clearInterval(this.statsInterval);
        }
    },
};
</script>
