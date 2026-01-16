<template>
    <div class="row mb-4">
        <div class="col-md-12">
            <h1 class="h2 mb-3">Jobs</h1>

            <!-- Filters -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row g-3">
                        <div class="col-md-3">
                            <label class="form-label">Status</label>
                            <select v-model="filters.status" class="form-select form-select-sm">
                                <option value="">All Statuses</option>
                                <option value="processed">Processed</option>
                                <option value="failed">Failed</option>
                                <option value="processing">Processing</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Queue</label>
                            <input v-model="filters.queue" type="text" class="form-control form-control-sm" placeholder="Filter by queue...">
                        </div>
                        <div class="col-md-3">
                            <label class="form-label">Job Class</label>
                            <input v-model="filters.job_class" type="text" class="form-control form-control-sm" placeholder="Filter by class...">
                        </div>
                        <div class="col-md-3 d-flex align-items-end">
                            <button @click="fetchJobs" class="btn btn-primary btn-sm w-100">
                                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Filter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Jobs Table -->
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
                        No jobs found
                    </div>
                    <div v-else class="table-responsive">
                        <table class="table table-sm table-hover mb-0">
                            <thead>
                                <tr>
                                    <th>Job</th>
                                    <th>Queue</th>
                                    <th>Status</th>
                                    <th>Duration</th>
                                    <th>Created</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="job in jobs" :key="job.id">
                                    <td class="text-truncate" :title="job.job_class">{{ job.job_class }}</td>
                                    <td>{{ job.queue }}</td>
                                    <td>
                                        <span :class="statusBadgeClass(job.status)" class="badge">
                                            {{ job.status }}
                                        </span>
                                    </td>
                                    <td>{{ job.formatted_duration }}</td>
                                    <td>{{ formatDate(job.created_at) }}</td>
                                    <td>
                                        <button @click="viewJob(job.id)" class="btn btn-link btn-sm">
                                            View
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.last_page > 1" class="d-flex justify-content-center mt-4">
                <nav aria-label="Page navigation">
                    <ul class="pagination">
                        <li :class="{ disabled: pagination.current_page === 1 }" class="page-item">
                            <button @click="changePage(pagination.current_page - 1)" class="page-link">Previous</button>
                        </li>
                        <li v-for="page in visiblePages" :key="page" :class="{ active: page === pagination.current_page }" class="page-item">
                            <button @click="changePage(page)" class="page-link">{{ page }}</button>
                        </li>
                        <li :class="{ disabled: pagination.current_page === pagination.last_page }" class="page-item">
                            <button @click="changePage(pagination.current_page + 1)" class="page-link">Next</button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'Jobs',
    data() {
        return {
            jobs: [],
            filters: {
                status: '',
                queue: '',
                job_class: '',
            },
            loading: false,
            pagination: {
                current_page: 1,
                last_page: 1,
                total: 0,
                per_page: 50,
            },
        };
    },
    computed: {
        visiblePages() {
            const pages = [];
            const start = Math.max(1, this.pagination.current_page - 2);
            const end = Math.min(this.pagination.last_page, this.pagination.current_page + 2);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            return pages;
        },
    },
    methods: {
        async fetchJobs() {
            this.loading = true;
            try {
                const params = {
                    page: this.pagination.current_page,
                    ...this.filters,
                };

                const response = await axios.get(`${window.Vantage.api_prefix}/jobs`, { params });
                this.jobs = response.data.data;
                this.pagination = response.data.pagination;
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
        changePage(page) {
            this.pagination.current_page = page;
            this.fetchJobs();
        },
    },
    mounted() {
        this.fetchJobs();
    },
    watch: {
        'filters.status': () => { this.pagination.current_page = 1; },
        'filters.queue': () => { this.pagination.current_page = 1; },
        'filters.job_class': () => { this.pagination.current_page = 1; },
    },
};
</script>
