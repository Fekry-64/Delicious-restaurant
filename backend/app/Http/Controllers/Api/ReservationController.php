<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReservationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Reservation::query();
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('date')) {
            $query->whereDate('reservation_date', $request->date);
        }
        
        $reservations = $query->orderBy('reservation_date', 'desc')
            ->orderBy('reservation_time', 'desc')
            ->paginate(15);
        
        return response()->json([
            'success' => true,
            'data' => $reservations
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'reservation_date' => 'required|date|after:today',
            'reservation_time' => 'required|date_format:H:i',
            'guests' => 'required|integer|min:1|max:20',
            'special_requests' => 'nullable|string|max:1000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $data['status'] = 'pending';

        $reservation = Reservation::create($data);

        return response()->json([
            'success' => true,
            'data' => $reservation,
            'message' => 'Reservation created successfully'
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $reservation = Reservation::find($id);
        
        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $reservation
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $reservation = Reservation::find($id);
        
        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'phone' => 'sometimes|required|string|max:20',
            'reservation_date' => 'sometimes|required|date',
            'reservation_time' => 'sometimes|required|date_format:H:i',
            'guests' => 'sometimes|required|integer|min:1|max:20',
            'special_requests' => 'nullable|string|max:1000',
            'status' => 'sometimes|required|in:pending,confirmed,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $reservation->update($validator->validated());

        return response()->json([
            'success' => true,
            'data' => $reservation,
            'message' => 'Reservation updated successfully'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $reservation = Reservation::find($id);
        
        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }

        $reservation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Reservation deleted successfully'
        ]);
    }

    /**
     * Update reservation status
     */
    public function updateStatus(Request $request, string $id)
    {
        $reservation = Reservation::find($id);
        
        if (!$reservation) {
            return response()->json([
                'success' => false,
                'message' => 'Reservation not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,confirmed,cancelled'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $reservation->update(['status' => $request->status]);

        return response()->json([
            'success' => true,
            'data' => $reservation,
            'message' => 'Reservation status updated successfully'
        ]);
    }

    /**
     * Get today's reservations
     */
    public function today()
    {
        $reservations = Reservation::today()
            ->orderBy('reservation_time')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reservations
        ]);
    }

    /**
     * Get upcoming reservations
     */
    public function upcoming()
    {
        $reservations = Reservation::upcoming()
            ->orderBy('reservation_date')
            ->orderBy('reservation_time')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $reservations
        ]);
    }
}
