<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Cloudinary\Cloudinary;

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

    public function all()
    {
        return response()->json(
            Product::latest()->get()
        );
    }

    public function show(int $id)
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
            'status' => 'required',
            'is_featured' => 'nullable|boolean'
        ]);

        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_KEY'),
                'api_secret' => env('CLOUDINARY_SECRET'),
            ],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $cloudinary->uploadApi()->upload(
                $request->file('image')->getRealPath(),
                ['folder' => 'products']
            )['secure_url'];
        }

        if ($request->hasFile('gallery')) {
            $gallery = [];

            foreach ($request->file('gallery') as $file) {
                $gallery[] = $cloudinary->uploadApi()->upload(
                    $file->getRealPath(),
                    ['folder' => 'products']
                )['secure_url'];
            }

            $data['gallery'] = $gallery;
        }

        $product = Product::create($data);

        return response()->json($product, 201);
    }

    public function update(Request $request, int $id)
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
            'is_featured' => 'nullable|boolean',
        ]);

        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_KEY'),
                'api_secret' => env('CLOUDINARY_SECRET'),
            ],
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $cloudinary->uploadApi()->upload(
                $request->file('image')->getRealPath(),
                ['folder' => 'products']
            )['secure_url'];
        }

        $gallery = [];

        if ($request->filled('existingGallery')) {
            $gallery = json_decode($request->existingGallery, true) ?? [];
        }

        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $gallery[] = $cloudinary->uploadApi()->upload(
                    $file->getRealPath(),
                    ['folder' => 'products']
                )['secure_url'];
            }
        }

        $data['gallery'] = $gallery;

        $product->update($data);

        return response()->json($product);
    }

    public function destroy(int $id)
    {
        $product = Product::findOrFail($id);

        $cloudinary = new Cloudinary([
            'cloud' => [
                'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
                'api_key'    => env('CLOUDINARY_KEY'),
                'api_secret' => env('CLOUDINARY_SECRET'),
            ],
        ]);

        $deleteFromCloudinary = function ($url) use ($cloudinary) {
            if (!$url || !str_contains($url, 'res.cloudinary.com')) return;

            $parts = explode('/upload/', $url);
            if (count($parts) < 2) return;

            $path = preg_replace('/^v\d+\//', '', $parts[1]);
            $publicId = pathinfo($path, PATHINFO_DIRNAME) . '/' . pathinfo($path, PATHINFO_FILENAME);

            $cloudinary->uploadApi()->destroy($publicId);
        };

        $deleteFromCloudinary($product->image);

        if ($product->gallery && is_array($product->gallery)) {
            foreach ($product->gallery as $img) {
                $deleteFromCloudinary($img);
            }
        }

        $product->delete();

        return response()->json([
            'message' => 'Product deleted permanently'
        ]);
    }

    public function toggleFeatured(int $id)
    {
        $product = Product::findOrFail($id);
        $product->is_featured = !$product->is_featured;
        $product->save();

        return response()->json([
            'message' => 'Product featured status updated',
            'product' => $product
        ]);
    }
}
