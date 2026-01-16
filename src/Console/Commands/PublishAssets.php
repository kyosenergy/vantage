<?php

namespace HoudaSlassi\Vantage\Console\Commands;

use Illuminate\Console\Command;

class PublishAssets extends Command
{
    protected $signature = 'vantage:publish';

    protected $description = 'Publish Vantage assets and configuration';

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

        $this->info('Vantage assets published successfully.');

        return self::SUCCESS;
    }
}
