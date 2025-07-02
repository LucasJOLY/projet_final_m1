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
        if (!$user->is_admin) {
            return $this->sendForbidden();
        }
        $query = Account::query();

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


        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('first_name', 'like', '%' . $searchTerm . '%')
                    ->orWhere('email', 'like', '%' . $searchTerm . '%')
                    ->orWhere('phone', 'like', '%' . $searchTerm . '%')
                    ->orWhere('address', 'like', '%' . $searchTerm . '%')
                    ->orWhere('max_annual_revenue', 'like', '%' . $searchTerm . '%')
                    ->orWhere('expense_rate', 'like', '%' . $searchTerm . '%');
            });
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
        return $this->sendResponse($query->paginate($perPage));
    }

    public function store(AccountRequest $request)
    {
        $validated = $request->validated();
        $validated['password'] = bcrypt($validated['password']);
        $account = Account::create($validated);
        return $this->sendCreated($account, 'account');
    }

    public function show(Account $account, Request $request)
    {

        return $this->sendResponse($account);
    }

    public function update(AccountRequest $request, Account $account)
    {
        $validated = $request->validated();
        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }
        $account->update($validated);
        return $this->sendUpdated($account, 'account');
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
