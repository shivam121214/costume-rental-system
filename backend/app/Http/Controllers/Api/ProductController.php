<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json(
            Product::where('status', 'available')
                ->latest()
                ->get()
        );
    }

    public function show($id)
    {
        return response()->json(Product::findOrFail($id));
    }

    public function store(Request $request)
    {
        $request->merge([
            'variants' => json_decode($request->variants, true)
        ]);

        $data = $request->validate([
            'name' => 'required',
            'category' => 'nullable',
            'description' => 'nullable',
            'image' => 'nullable|file|image|max:5120',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:5120',
            'rent_price' => 'required|numeric',
            'security_deposit' => 'required|numeric|min:0',
            'variants' => 'nullable|array',
            'total_quantity' => 'required|integer',
            'sizes' => 'nullable',
            'status' => 'required'
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = Cloudinary::upload(
                $request->file('image')->getRealPath(),
                ['folder' => 'products']
            )->getSecurePath();
        }

        if ($request->hasFile('gallery')) {
            $gallery = [];

            foreach ($request->file('gallery') as $file) {
                $gallery[] = Cloudinary::upload(
                    $file->getRealPath(),
                    ['folder' => 'products']
                )->getSecurePath();
            }

            $data['gallery'] = $gallery;
        }

        $product = Product::create($data);

        return response()->json($product, 201);
    }

    public function update(Request $request, $id)
    {
        $request->merge([
            'variants' => json_decode($request->variants, true)
        ]);

        $product = Product::findOrFail($id);

        $data = $request->validate([
            'name' => 'required',
            'category' => 'nullable',
            'description' => 'nullable',
            'image' => 'nullable|file|image|max:5120',
            'gallery' => 'nullable|array',
            'gallery.*' => 'image|max:5120',
            'existingGallery' => 'nullable',
            'rent_price' => 'required|numeric',
            'security_deposit' => 'required|numeric|min:0',
            'variants' => 'nullable|array',
            'total_quantity' => 'required|integer',
            'sizes' => 'nullable',
            'status' => 'required',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('products', 'public');
        }

        $gallery = [];

        if ($request->filled('existingGallery')) {
            $gallery = json_decode($request->existingGallery, true) ?? [];
        }

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $gallery[] = $file->store('products', 'public');
            }
        }

        $data['gallery'] = $gallery;

        $product->update($data);

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        if ($product->gallery && is_array($product->gallery)) {
            foreach ($product->gallery as $img) {
                Storage::disk('public')->delete($img);
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted permanently'
        ]);
    }
}
