<?php

namespace App\Observers;

use App\Models\Setting;

class SettingObserver
{
    /**
     * Handle the Setting "saved" event.
     */
    public function saved(Setting $setting): void
    {
        Setting::clearCache($setting->key_name);
    }

    /**
     * Handle the Setting "deleted" event.
     */
    public function deleted(Setting $setting): void
    {
        Setting::clearCache($setting->key_name);
    }
}
