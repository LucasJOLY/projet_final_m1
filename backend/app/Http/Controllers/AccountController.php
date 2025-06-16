<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\BaseController;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\Rule;
use App\Http\Requests\AccountRequest;

class AccountController extends BaseController
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Account::query()->where('id', $user->id);

        // Filtres avancés
        $fields = [
            'name',
            'first_name',
            'birth_date',
            'address',
            'email',
            'phone',
            'max_annual_revenue',
            'expense_rate',
            'role',
            'created_at',
            'updated_at',
        ];
        foreach ($fields as $field) {
            if ($request->filled($field)) {
                $query->where($field, $request->input($field));
            }
            // Filtres >, <, entre pour int/date
            if ($request->filled($field . '_min')) {
                $query->where($field, '>=', $request->input($field . '_min'));
            }
            if ($request->filled($field . '_max')) {
                $query->where($field, '<=', $request->input($field . '_max'));
            }
        }

        // Tri dynamique
        $sort = $request->input('sort_by', 'id');
        $order = $request->input('sort_order', 'asc');
        if (in_array($sort, $fields) && in_array($order, ['asc', 'desc'])) {
            $query->orderBy($sort, $order);
        }
        // Tri par date de création
        if ($request->input('sort_by') === 'created_at') {
            $query->orderBy('created_at', $order);
        }

        $perPage = $request->integer('per_page', 20);
        return $this->sendResponse(JsonResource::collection($query->paginate($perPage)));
    }

    public function store(AccountRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = bcrypt($validated['password']);
        $account = Account::create($validated);
        return $this->sendCreated(new JsonResource($account), 'account');
    }

    public function show($locale, Account $account, Request $request)
    {
        if ($request->user()->id !== $account->id) {
            return $this->sendForbidden();
        }
        return $this->sendResponse(new JsonResource($account));
    }

    public function update(AccountRequest $request, Account $account)
    {
        if ($request->user()->id !== $account->id) {
            return $this->sendForbidden();
        }
        $validated = $request->validated();
        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }
        $account->update($validated);
        return $this->sendUpdated(new JsonResource($account), 'account');
    }

    public function destroy(Account $account, Request $request)
    {
        if ($request->user()->id !== $account->id) {
            return $this->sendForbidden();
        }
        $account->delete();
        return $this->sendDeleted('account');
    }
}
