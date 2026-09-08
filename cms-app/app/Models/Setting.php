<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

#[Fillable(['setting_group', 'key_name', 'setting_value', 'is_autoload'])]
class Setting extends Model
{
    use HasFactory;

    public const CACHE_KEY_PREFIX = 'cms_setting_';

    public const AUTOLOAD_CACHE_KEY = 'cms_settings_autoload';

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_autoload' => 'boolean',
        ];
    }

    /**
     * Retrieve a setting value by key with cache.
     */
    public static function get(string $key, mixed $default = null): mixed
    {
        // Check autoloaded cache first
        $autoloaded = static::getAutoloaded();
        if (array_key_exists($key, $autoloaded)) {
            return $autoloaded[$key];
        }

        return Cache::rememberForever(self::CACHE_KEY_PREFIX.$key, function () use ($key, $default) {
            $setting = static::where('key_name', $key)->first();

            return $setting !== null ? $setting->setting_value : $default;
        });
    }

    /**
     * Set or update a setting value.
     */
    public static function set(string $key, mixed $value, string $group = 'general', bool $isAutoload = false): self
    {
        $setting = static::updateOrCreate(
            ['key_name' => $key],
            [
                'setting_group' => $group,
                'setting_value' => is_array($value) ? json_encode($value) : (string) $value,
                'is_autoload' => $isAutoload,
            ]
        );

        static::clearCache($key);

        return $setting;
    }

    /**
     * Get all autoloaded settings as key-value pairs.
     */
    public static function getAutoloaded(): array
    {
        return Cache::rememberForever(self::AUTOLOAD_CACHE_KEY, function () {
            return static::where('is_autoload', true)
                ->pluck('setting_value', 'key_name')
                ->toArray();
        });
    }

    /**
     * Clear the cache for settings.
     */
    public static function clearCache(?string $key = null): void
    {
        Cache::forget(self::AUTOLOAD_CACHE_KEY);

        if ($key !== null) {
            Cache::forget(self::CACHE_KEY_PREFIX.$key);
        }
    }
}
