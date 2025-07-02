<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\BaseController;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\Rule;
use App\Http\Requests\ProjectRequest;

class ProjectController extends BaseController
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Project::with('client')->whereHas('client', function ($q) use ($user) {
            $q->where('account_id', $user->id);
        });

        // Gérer le filtre par client_id
        if ($request->filled('client_id')) {
            $query->where('client_id', $request->input('client_id'));
        }

        // Gérer le filtre par nom
        if ($request->filled('name')) {
            $query->where('name', 'like', '%' . $request->input('name') . '%');
        }

        // Gérer le filtre multiple par statut (status[])
        if ($request->filled('status')) {
            $statuses = $request->input('status');
            if (is_array($statuses)) {
                $query->whereIn('status', $statuses);
            } else {
                $query->where('status', $statuses);
            }
        }

        // Gérer la recherche globale
        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('client', function ($clientQuery) use ($searchTerm) {
                        $clientQuery->where('name', 'like', '%' . $searchTerm . '%');
                    });
            });
        }

        // Gérer les filtres de date
        $dateFields = ['created_at', 'updated_at'];
        foreach ($dateFields as $field) {
            if ($request->filled($field . '_min')) {
                $query->where($field, '>=', $request->input($field . '_min'));
            }
            if ($request->filled($field . '_max')) {
                $query->where($field, '<=', $request->input($field . '_max'));
            }
        }

        // Gérer le tri
        $sort = $request->input('sort_by', 'created_at');
        $order = $request->input('sort_order', 'desc');
        $allowedSortFields = ['id', 'name', 'status', 'client_id', 'created_at', 'updated_at'];

        if (in_array($sort, $allowedSortFields) && in_array($order, ['asc', 'desc'])) {
            $query->orderBy($sort, $order);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->integer('per_page', 20);

        return $this->sendResponse($query->paginate($perPage));
    }

    public function store(ProjectRequest $request)
    {
        $validated = $request->validated();
        $project = Project::create($validated);
        return $this->sendCreated($project, 'project');
    }

    public function show(Project $project, Request $request)
    {
        if ($request->user()->id !== $project->client->account_id) {
            return $this->sendForbidden();
        }
        return $this->sendResponse($project);
    }

    public function update(ProjectRequest $request, Project $project)
    {
        if ($request->user()->id !== $project->client->account_id) {
            return $this->sendForbidden();
        }
        $validated = $request->validated();
        $project->update($validated);
        return $this->sendUpdated($project, 'project');
    }

    public function destroy(Project $project, Request $request)
    {
        if ($request->user()->id !== $project->client->account_id) {
            return $this->sendForbidden();
        }
        if ($project->invoices()->exists()) {
            return $this->sendError('project.delete.error.invoices');
        }
        $project->delete();
        return $this->sendDeleted('project');
    }
}
