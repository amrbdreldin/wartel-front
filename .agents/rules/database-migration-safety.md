---
trigger: always_on
---

# Database & Migration Safety Rules (Mandatory)

When working on the companion Laravel backend (`d:\laragon\www\wartel`), NEVER run any destructive database or migration commands, including:
- `php artisan migrate:fresh`
- `php artisan migrate:reset`
- `php artisan migrate:refresh`
- `php artisan migrate:rollback` (unless explicitly requested by the user for a specific newly added migration)
- `php artisan db:wipe`

Only use `php artisan migrate` after checking `php artisan migrate:status`.
