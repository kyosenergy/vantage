<?php

namespace HoudaSlassi\Vantage\Console\Commands;

use Illuminate\Console\Command;

class InstallCommand extends Command
{
    protected $signature = 'vantage:install';

    protected $description = 'Install Vantage assets, configuration and migrations';

    public function handle(): int
    {
        $this->call('vendor:publish', [
            '--tag' => 'vantage-config',
            '--force' => true,
        ]);

        $this->call('vendor:publish', [
            '--tag' => 'vantage-assets',
            '--force' => true,
        ]);

        $this->call('vendor:publish', [
            '--tag' => 'vantage-migrations',
            '--force' => true,
        ]);

        $this->info('Vantage assets installed successfully.');

        return self::SUCCESS;
    }
}
