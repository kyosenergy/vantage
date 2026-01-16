<template>
    <div class="d-flex flex-column vh-100">
        <!-- Navigation -->
        <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
            <div class="container-fluid">
                <router-link to="/" class="navbar-brand d-flex align-items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor" class="text-primary">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2v20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <strong>Vantage</strong>
                </router-link>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarNav">
                    <div class="navbar-nav ms-auto">
                        <router-link to="/" class="nav-link" active-class="active">Dashboard</router-link>
                        <router-link to="/jobs" class="nav-link" active-class="active">All Jobs</router-link>
                        <router-link to="/failed" class="nav-link" active-class="active">Failed Jobs</router-link>
                        <router-link to="/tags" class="nav-link" active-class="active">Tags</router-link>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="flex-grow-1 p-4">
            <router-view></router-view>
        </main>
    </div>
</template>

<script>
export default {
    name: 'App',
};
</script>

<style scoped>
nav {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

main {
    overflow-y: auto;
}
</style>
