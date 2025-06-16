<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class Localization
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    // App\Http\Middleware\Localization.php

    public function handle(Request $request, Closure $next)
    {
        // ⚠️ NE PAS se baser sur $request->segments() ici, car ça dépend de la structure exacte de l'URL

        $locale = $request->route('locale');

        if (in_array($locale, ['fr', 'en'])) {
            App::setLocale($locale);
            Session::put('locale', $locale);
        } else {
            // fallback en cas de route manquée
            $locale = config('app.locale');
            App::setLocale($locale);
        }

        return $next($request);
    }
}
