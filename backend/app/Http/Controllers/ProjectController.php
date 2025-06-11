<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\Rule;
use App\Http\Requests\ProjectRequest;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Project::whereHas('client', function ($q) use ($user) {
            $q->where('account_id', $user->id);
        });

        $fields = [
            'client_id',
            'name',
            'status',
            'created_at',
            'updated_at',
        ];
        foreach ($fields as $field) {
            if ($request->filled($field)) {
                $query->where($field, $request->input($field));
            }
            if ($request->filled($field . '_min')) {
                $query->where($field, '>=', $request->input($field + '_min'));
            }
            if ($request->filled($field + '_max')) {
                $query->where($field, '<=', $request->input($field + '_max'));
            }
        }

        $sort = $request->input('sort_by', 'id');
        $order = $request->input('sort_order', 'asc');
        if (in_array($sort, $fields) && in_array($order, ['asc', 'desc'])) {
            $query->orderBy($sort, $order);
        }
        if ($request->input('sort_by') === 'created_at') {
            $query->orderBy('created_at', $order);
        }

        $perPage = $request->integer('per_page', 20);
        return JsonResource::collection($query->paginate($perPage));
    }

    public function store(ProjectRequest $request)
    {
        $validated = $request->validated();
        $project = Project::create($validated);
        return new JsonResource($project);
    }

    public function show(Project $project, Request $request)
    {
        if ($request->user()->id !== $project->client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        return new JsonResource($project);
    }

    public function update(ProjectRequest $request, Project $project)
    {
        if ($request->user()->id !== $project->client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        $validated = $request->validated();
        $project->update($validated);
        return new JsonResource($project);
    }

    public function destroy(Project $project, Request $request)
    {
        if ($request->user()->id !== $project->client->account_id) {
            return response()->json(['message' => 'Accès interdit.'], 403);
        }
        $project->delete();
        return response()->json(['message' => 'Projet supprimé avec succès.']);
    }
}
