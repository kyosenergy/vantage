<?php

namespace HoudaSlassi\Vantage;

use Illuminate\Queue\Events\JobFailed;
use Illuminate\Queue\Events\JobProcessed;
use Illuminate\Queue\Events\JobProcessing;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class VantageServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // Load our default config so config('vantage') works
        $this->mergeConfigFrom(__DIR__.'/../config/vantage.php', 'vantage');
    }

    public function boot(): void
    {
        $this->publishes([
            __DIR__.'/../config/vantage.php' => config_path('vantage.php'),
        ], 'vantage-config');

        $this->publishes([
            __DIR__.'/../public' => public_path('vendor/vantage'),
        ], 'vantage-assets');

        $this->publishes([
            __DIR__.'/../database/migrations' => database_path('migrations'),
        ], 'vantage-migrations');

        if ($this->app->runningInConsole()) {
            $this->commands([
                Console\Commands\InstallCommand::class,
                Console\Commands\PublishAssets::class,
            ]);
        }

        // Master switch: if package is disabled, don't register anything
        if (! config('vantage.enabled', true)) {
            return;
        }

        if ($this->app->runningInConsole()) {
            $this->commands([
                Console\Commands\RetryFailedJob::class,
                Console\Commands\CleanupStuckJobs::class,
                Console\Commands\PruneOldJobs::class,
                Console\Commands\BackfillJobTags::class,
            ]);
        }

        // Register authorization gate (like Horizon)
        Gate::define('viewVantage', function ($user = null) {
            // If auth is disabled, allow access
            if (! config('vantage.auth.enabled', true)) {
                return true;
            }

            // If no user, deny access
            if (! $user) {
                return false;
            }

            // Allow all authenticated users by default
            // Users can customize this in their AppServiceProvider
            return true;
        });

        // Load migrations from package if not published to app
        if (! $this->migrationsPublished()) {
            $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        }

        // Load views
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'vantage');

        // Load routes if enabled
        if (config('vantage.routes', true)) {
            $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        }

        // Listen to Laravel's built-in queue events
        Event::listen(JobProcessing::class, [Listeners\RecordJobStart::class, 'handle']);
        Event::listen(JobProcessed::class, [Listeners\RecordJobSuccess::class, 'handle']);
        Event::listen(JobFailed::class, [Listeners\RecordJobFailure::class, 'handle']);
    }

    /**
     * Check if migrations have been published to the application.
     * We check for any vantage migration file pattern in the app's migrations folder.
     */
    protected function migrationsPublished(): bool
    {
        $migrationsPath = database_path('migrations');

        if (! is_dir($migrationsPath)) {
            return false;
        }

        // Look for any migration containing 'vantage' or 'queue_job_runs' in the filename
        $files = scandir($migrationsPath);

        foreach ($files as $file) {
            if (str_contains($file, 'vantage') || str_contains($file, 'queue_job_runs')) {
                return true;
            }
        }

        return false;
    }
}
