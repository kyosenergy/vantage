import Dashboard from '@/screens/Dashboard.vue';
import Jobs from '@/screens/Jobs.vue';
import JobDetail from '@/screens/JobDetail.vue';
import Failed from '@/screens/Failed.vue';
import Tags from '@/screens/Tags.vue';

const routes = [
    {
        path: '/',
        name: 'dashboard',
        component: Dashboard,
    },
    {
        path: '/jobs',
        name: 'jobs',
        component: Jobs,
    },
    {
        path: '/jobs/:id',
        name: 'job-detail',
        component: JobDetail,
    },
    {
        path: '/failed',
        name: 'failed',
        component: Failed,
    },
    {
        path: '/tags',
        name: 'tags',
        component: Tags,
    },
];

export default routes;
