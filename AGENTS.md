# AGENTS.md - Vantage

> Vantage: Strategic queue monitoring and observability for Laravel applications.

## Project Overview

This is a **Laravel package** (not a standalone app) that provides queue job monitoring via event listeners. It tracks job execution history, failures, retries, and provides a web dashboard.

- **PHP 8.2+** with **Laravel 10/11/12** support
- **Pest** for testing (PHPUnit-compatible)
- **Laravel Pint** for code formatting (PSR-12)
- **PHPStan** (level 5) with Larastan for static analysis
- **Orchestra Testbench** for package testing

## Build/Lint/Test Commands

```bash
# Install dependencies
composer install

# Run all tests
composer test
# Or directly:
./vendor/bin/pest

# Run a single test file
./vendor/bin/pest tests/Unit/VantageJobTest.php

# Run tests matching a pattern
./vendor/bin/pest --filter="records job start"

# Run tests in parallel (faster)
./vendor/bin/pest -p

# Run with coverage
./vendor/bin/pest --coverage

# Code formatting (Laravel Pint - PSR-12)
composer format

# Check formatting without fixing
composer lint

# Static analysis (PHPStan level 5)
composer analyse

# Run all checks (lint + analyse + test)
composer check
```

## Code Style Guidelines

### PHP Standards

- **PSR-12** coding standard enforced via Laravel Pint
- **4 spaces** indentation (no tabs)
- **LF** line endings
- **UTF-8** encoding
- Final newline required

### Imports

```php
<?php

namespace HoudaSlassi\Vantage;

use HoudaSlassi\Vantage\Models\VantageJob;  // Package imports first
use Illuminate\Support\Collection;           // Laravel/framework imports
use Illuminate\Support\Facades\DB;

class Example
{
    // ...
}
```

- Group imports: package classes, then framework classes
- One class per `use` statement
- Alphabetical order within groups

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `VantageJob`, `QueueMonitorController` |
| Methods | camelCase | `getFormattedDuration()`, `hasTag()` |
| Properties | camelCase | `$jobClass`, `$startedAt` |
| Constants | SCREAMING_SNAKE | `STATUS_FAILED` |
| Config keys | snake_case | `store_payload`, `retention_days` |
| Database columns | snake_case | `job_class`, `started_at` |
| Routes | kebab-case | `/vantage/failed-jobs` |

### Type Declarations

```php
// Always use return types
public function getFormattedDurationAttribute(): string

// Use nullable when appropriate
public function getConnectionName(): ?string

// Array type hints with PHPDoc for complex arrays
/**
 * @return array{total: int, processed: int, failed: int}
 */
public function statistics(): array
```

### Error Handling

```php
// Use VantageLogger for package logging (respects config)
VantageLogger::warning('Failed to get queue depths', ['error' => $e->getMessage()]);
VantageLogger::error('Retry failed', ['job_id' => $id, 'error' => $e->getMessage()]);

// Catch specific exceptions, not generic \Exception
try {
    $job = @unserialize($serialized, ['allowed_classes' => [$expectedJobClass]]);
} catch (\Throwable $e) {
    return null;
}

// Return early on failure conditions
if (!$job || $job->status !== 'failed') {
    return false;
}
```

### Model Patterns

```php
// Use $unguarded for package models (not $fillable)
protected static $unguarded = true;

// Define casts for proper type handling
protected $casts = [
    'started_at' => 'datetime',
    'job_tags' => 'array',
    'duration_ms' => 'integer',
];

// Use query scopes for reusable filters
public function scopeFailed($query)
{
    return $query->where('status', 'failed');
}

// Use accessors for computed properties
public function getFormattedDurationAttribute(): string
{
    return $this->duration_ms < 1000 
        ? $this->duration_ms . 'ms' 
        : round($this->duration_ms / 1000, 2) . 's';
}
```

### Testing Patterns

Tests use **Pest** syntax:

```php
// Use descriptive test names
it('records job start when job processing event is fired', function () {
    // Arrange
    $job = new class { /* ... */ };
    
    // Act
    $listener = new RecordJobStart;
    $listener->handle(new JobProcessing('test-connection', $job));
    
    // Assert
    expect(VantageJob::where('uuid', 'test-uuid-123')->first())
        ->not->toBeNull()
        ->and($record->status)->toBe('processing');
});

// Clean up before each test
beforeEach(function () {
    VantageJob::query()->delete();
});

// Use factories for test data
$job = VantageJob::factory()->failed()->create();
$job = VantageJob::factory()->withTags(['email'])->create();
```

### Architecture Tests

```php
// Prevent debugging functions in production code
arch('it will not use debugging functions')
    ->expect(['dd', 'dump', 'ray'])
    ->each->not->toBeUsed();
```

## Project Structure

```
src/
├── Console/Commands/     # Artisan commands
├── Facades/              # Laravel facades
├── Http/
│   ├── Controllers/      # Web controllers
│   └── Middleware/       # Route middleware
├── Listeners/            # Queue event listeners
├── Models/               # Eloquent models
├── Notifications/        # Laravel notifications
├── Support/              # Helper classes
├── Vantage.php           # Main service class
└── VantageServiceProvider.php

tests/
├── Feature/              # Integration tests
├── Unit/                 # Unit tests
├── ArchTest.php          # Architecture tests
├── Pest.php              # Pest configuration
└── TestCase.php          # Base test case
```

## Key Classes

- `VantageServiceProvider` - Package bootstrap, event listeners, routes
- `Vantage` - Main service class (facade target)
- `VantageJob` - Eloquent model for tracked jobs
- `RecordJobStart/Success/Failure` - Queue event listeners
- `QueueMonitorController` - Dashboard web controller

## Database

- Main table: `vantage_jobs` (stores all job execution records)
- Uses configurable database connection via `vantage.database_connection`
- Supports MySQL, PostgreSQL, and SQLite

## Configuration

Config file: `config/vantage.php`

Key settings:
- `enabled` - Master switch for entire package
- `store_payload` - Whether to store job payloads
- `retention_days` - Days to keep job history
- `telemetry.enabled` - Performance metrics collection

## Contributing Requirements

1. **Add tests** - All patches require tests
2. **Follow PSR-12** - Run `composer format` before committing
3. **Pass static analysis** - Run `composer analyse`
4. **One feature per PR** - Keep PRs focused
5. **Squash commits** - Clean git history
