<template>
    <div class="row mb-4">
        <div class="col-md-12">
            <h1 class="h2 mb-3">Tags</h1>
        </div>
    </div>

    <div class="row">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <div v-if="loading && tags.length === 0" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    <div v-else-if="tags.length === 0" class="text-muted text-center py-4">
                        No tags found
                    </div>
                    <div v-else class="table-responsive">
                        <table class="table table-sm table-hover mb-0">
                            <thead>
                                <tr>
                                    <th @click="sortBy('name')" style="cursor: pointer;">
                                        Tag Name
                                        <i v-if="sortField === 'name'" :class="sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down'"></i>
                                    </th>
                                    <th @click="sortBy('total')" style="cursor: pointer;">
                                        Total Jobs
                                        <i v-if="sortField === 'total'" :class="sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down'"></i>
                                    </th>
                                    <th @click="sortBy('processed')" style="cursor: pointer;">
                                        Processed
                                        <i v-if="sortField === 'processed'" :class="sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down'"></i>
                                    </th>
                                    <th @click="sortBy('failed')" style="cursor: pointer;">
                                        Failed
                                        <i v-if="sortField === 'failed'" :class="sortDirection === 'asc' ? 'bi-sort-up' : 'bi-sort-down'"></i>
                                    </th>
                                    <th>Success Rate</th>
                                    <th>Avg Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="tag in tags" :key="tag.name" @click="viewTagJobs(tag.name)" style="cursor: pointer;">
                                    <td>
                                        <span class="badge bg-primary">{{ tag.name }}</span>
                                    </td>
                                    <td>{{ tag.total }}</td>
                                    <td><span class="badge bg-success">{{ tag.processed }}</span></td>
                                    <td><span class="badge bg-danger">{{ tag.failed }}</span></td>
                                    <td>
                                        <span :class="successRateClass(tag.success_rate)">
                                            {{ tag.success_rate }}%
                                        </span>
                                    </td>
                                    <td>{{ tag.avg_duration_ms }}ms</td>
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
    name: 'Tags',
    data() {
        return {
            tags: [],
            loading: false,
            sortField: 'total',
            sortDirection: 'desc',
        };
    },
    methods: {
        async fetchTags() {
            this.loading = true;
            try {
                const response = await axios.get(`${window.Vantage.api_prefix}/tags`, {
                    params: {
                        sort: `${this.sortDirection === 'asc' ? '' : '-'}${this.sortField}`,
                    },
                });
                this.tags = response.data.data;
            } catch (error) {
                console.error('Failed to fetch tags:', error);
            } finally {
                this.loading = false;
            }
        },
        sortBy(field) {
            if (this.sortField === field) {
                this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                this.sortField = field;
                this.sortDirection = 'desc';
            }
            this.fetchTags();
        },
        successRateClass(rate) {
            if (rate >= 90) return 'badge bg-success';
            if (rate >= 70) return 'badge bg-warning';
            return 'badge bg-danger';
        },
        viewTagJobs(tagName) {
            this.$router.push(`/jobs?tags=${tagName}`);
        },
    },
    mounted() {
        this.fetchTags();
    },
};
</script>
