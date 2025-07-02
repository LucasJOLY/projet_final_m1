<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BaseController extends Controller
{
    /**
     * Succès de la réponse
     *
     * @param  array $result
     * @param  string $message
     * @param  string $resource
     * @return JsonResponse
     */
    public function sendResponse($result, $message = null, $resource = null): JsonResponse
    {
        $response = [
            'success' => true,
            'data'    => $result,
        ];

        if ($message) {
            $response['message'] = $message;
        } elseif ($resource) {
            $response['message'] = __('messages.created', ['resource' => __('messages.resources.' . $resource)]);
        }

        return response()->json($response, 200);
    }

    /**
     * Erreur de la réponse
     *
     * @param  string $error
     * @param  array  $errorMessages
     * @param  int    $code
     * @return JsonResponse
     */
    public function sendError($error, $errorMessages = [], $code = 404): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];

        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }

        return response()->json($response, $code);
    }

    /**
     * Réponse de succès pour la création
     *
     * @param  mixed  $result
     * @param  string $resource
     * @return JsonResponse
     */
    public function sendCreated($result, $resource): JsonResponse
    {
        return $this->sendResponse($result, null, $resource);
    }

    /**
     * Réponse de succès pour la mise à jour
     *
     * @param  mixed  $result
     * @param  string $resource
     * @return JsonResponse
     */
    public function sendUpdated($result, $resource): JsonResponse
    {
        return $this->sendResponse($result, 'messages.updated', $resource);
    }

    /**
     * Réponse de succès pour la suppression
     *
     * @param  string $resource
     * @return JsonResponse
     */
    public function sendDeleted($resource): JsonResponse
    {
        return $this->sendResponse(null, 'messages.deleted', $resource);
    }

    /**
     * Réponse d'erreur d'accès interdit
     *
     * @return JsonResponse
     */
    public function sendForbidden(): JsonResponse
    {
        return $this->sendError('messages.forbidden', [], 403);
    }

    /**
     * Réponse d'erreur de ressource non trouvée
     *
     * @return JsonResponse
     */
    public function sendNotFound(): JsonResponse
    {
        return $this->sendError('messages.not_found', [], 404);
    }
}
