import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import path from 'path';
import { fileURLToPath } from 'url';
import productModel from './models/productModel.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Path to the frontend's image assets, assuming backend and frontend are sibling folders
const ASSETS_DIR = path.join(__dirname, '..', 'frontend', 'src', 'assets');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

const desc = "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.";

// name, price, images (local filenames in frontend/src/assets), category, subCategory, sizes, bestseller
const demoProducts = [
    ["Women Round Neck Cotton Top", 100, ["p_img1.png"], "Women", "Topwear", ["S", "M", "L"], true],
    ["Men Round Neck Pure Cotton T-shirt", 200, ["p_img2_1.png", "p_img2_2.png", "p_img2_3.png", "p_img2_4.png"], "Men", "Topwear", ["M", "L", "XL"], true],
    ["Girls Round Neck Cotton Top", 220, ["p_img3.png"], "Kids", "Topwear", ["S", "L", "XL"], true],
    ["Men Round Neck Pure Cotton T-shirt", 110, ["p_img4.png"], "Men", "Topwear", ["S", "M", "XXL"], true],
    ["Women Round Neck Cotton Top", 130, ["p_img5.png"], "Women", "Topwear", ["M", "L", "XL"], true],
    ["Girls Round Neck Cotton Top", 140, ["p_img6.png"], "Kids", "Topwear", ["S", "L", "XL"], true],
    ["Men Tapered Fit Flat-Front Trousers", 190, ["p_img7.png"], "Men", "Bottomwear", ["S", "L", "XL"], false],
    ["Men Round Neck Pure Cotton T-shirt", 140, ["p_img8.png"], "Men", "Topwear", ["S", "M", "L", "XL"], false],
    ["Girls Round Neck Cotton Top", 100, ["p_img9.png"], "Kids", "Topwear", ["M", "L", "XL"], false],
    ["Men Tapered Fit Flat-Front Trousers", 110, ["p_img10.png"], "Men", "Bottomwear", ["S", "L", "XL"], false],
    ["Men Round Neck Pure Cotton T-shirt", 120, ["p_img11.png"], "Men", "Topwear", ["S", "M", "L"], false],
    ["Men Round Neck Pure Cotton T-shirt", 150, ["p_img12.png"], "Men", "Topwear", ["S", "M", "L", "XL"], false],
    ["Women Round Neck Cotton Top", 130, ["p_img13.png"], "Women", "Topwear", ["S", "M", "L", "XL"], false],
    ["Boy Round Neck Pure Cotton T-shirt", 160, ["p_img14.png"], "Kids", "Topwear", ["S", "M", "L", "XL"], false],
    ["Men Tapered Fit Flat-Front Trousers", 140, ["p_img15.png"], "Men", "Bottomwear", ["S", "M", "L", "XL"], false],
    ["Girls Round Neck Cotton Top", 170, ["p_img16.png"], "Kids", "Topwear", ["S", "M", "L", "XL"], false],
    ["Men Tapered Fit Flat-Front Trousers", 150, ["p_img17.png"], "Men", "Bottomwear", ["S", "M", "L", "XL"], false],
    ["Boy Round Neck Pure Cotton T-shirt", 180, ["p_img18.png"], "Kids", "Topwear", ["S", "M", "L", "XL"], false],
    ["Boy Round Neck Pure Cotton T-shirt", 160, ["p_img19.png"], "Kids", "Topwear", ["S", "M", "L", "XL"], false],
    ["Women Palazzo Pants with Waist Belt", 190, ["p_img20.png"], "Women", "Bottomwear", ["S", "M", "L", "XL"], false],
    ["Women Zip-Front Relaxed Fit Jacket", 170, ["p_img21.png"], "Women", "Winterwear", ["S", "M", "L", "XL"], false],
    ["Women Palazzo Pants with Waist Belt", 200, ["p_img22.png"], "Women", "Bottomwear", ["S", "M", "L", "XL"], false],
    ["Boy Round Neck Pure Cotton T-shirt", 180, ["p_img23.png"], "Kids", "Topwear", ["S", "M", "L", "XL"], false],
    ["Boy Round Neck Pure Cotton T-shirt", 210, ["p_img24.png"], "Kids", "Topwear", ["S", "M", "L", "XL"], false],
    ["Girls Round Neck Cotton Top", 190, ["p_img25.png"], "Kids", "Topwear", ["S", "M", "L", "XL"], false],
    ["Women Zip-Front Relaxed Fit Jacket", 220, ["p_img26.png"], "Women", "Winterwear", ["S", "M", "L", "XL"], false],
    ["Girls Round Neck Cotton Top", 200, ["p_img27.png"], "Kids", "Topwear", ["S", "M", "L", "XL"], false],
    ["Men Slim Fit Relaxed Denim Jacket", 230, ["p_img28.png"], "Men", "Winterwear", ["S", "M", "L", "XL"], false],
    ["Women Round Neck Cotton Top", 210, ["p_img29.png"], "Women", "Topwear", ["S", "M", "L", "XL"], false],
    ["Girls Round Neck Cotton Top", 240, ["p_img30.png"], "Kids", "Topwear", ["S", "M", "L", "XL"], false],
    ["Men Round Neck Pure Cotton T-shirt", 220, ["p_img31.png"], "Men", "Topwear", ["S", "M", "L", "XL"], false],
    ["Men Round Neck Pure Cotton T-shirt", 250, ["p_img32.png"], "Men", "Topwear", ["S", "M", "L", "XL"], false],
    ["Girls Round Neck Cotton Top", 230, ["p_img33.png"], "Kids", "Topwear", ["S", "M", "L", "XL"], false],
    ["Women Round Neck Cotton Top", 260, ["p_img34.png"], "Women", "Topwear", ["S", "M", "L", "XL"], false],
    ["Women Zip-Front Relaxed Fit Jacket", 240, ["p_img35.png"], "Women", "Winterwear", ["S", "M", "L", "XL"], false],
    ["Women Zip-Front Relaxed Fit Jacket", 270, ["p_img36.png"], "Women", "Winterwear", ["S", "M", "L", "XL"], false],
    ["Women Round Neck Cotton Top", 250, ["p_img37.png"], "Women", "Topwear", ["S", "M", "L", "XL"], false],
    ["Men Round Neck Pure Cotton T-shirt", 280, ["p_img38.png"], "Men", "Topwear", ["S", "M", "L", "XL"], false],
    ["Men Printed Plain Cotton Shirt", 260, ["p_img39.png"], "Men", "Topwear", ["S", "M", "L", "XL"], false],
    ["Men Slim Fit Relaxed Denim Jacket", 290, ["p_img40.png"], "Men", "Winterwear", ["S", "M", "L", "XL"], false],
    ["Men Round Neck Pure Cotton T-shirt", 270, ["p_img41.png"], "Men", "Topwear", ["S", "M", "L", "XL"], false],
    ["Boy Round Neck Pure Cotton T-shirt", 300, ["p_img42.png"], "Kids", "Topwear", ["S", "M", "L", "XL"], false],
    ["Kid Tapered Slim Fit Trouser", 280, ["p_img43.png"], "Kids", "Bottomwear", ["S", "M", "L", "XL"], false],
    ["Women Zip-Front Relaxed Fit Jacket", 310, ["p_img44.png"], "Women", "Winterwear", ["S", "M", "L", "XL"], false],
    ["Men Slim Fit Relaxed Denim Jacket", 290, ["p_img45.png"], "Men", "Winterwear", ["S", "M", "L", "XL"], false],
    ["Men Slim Fit Relaxed Denim Jacket", 320, ["p_img46.png"], "Men", "Winterwear", ["S", "M", "L", "XL"], false],
    ["Kid Tapered Slim Fit Trouser", 300, ["p_img47.png"], "Kids", "Bottomwear", ["S", "M", "L", "XL"], false],
    ["Men Slim Fit Relaxed Denim Jacket", 330, ["p_img48.png"], "Men", "Winterwear", ["S", "M", "L", "XL"], false],
    ["Kid Tapered Slim Fit Trouser", 310, ["p_img49.png"], "Kids", "Bottomwear", ["S", "M", "L", "XL"], false],
    ["Kid Tapered Slim Fit Trouser", 340, ["p_img50.png"], "Kids", "Bottomwear", ["S", "M", "L", "XL"], false],
    ["Women Zip-Front Relaxed Fit Jacket", 320, ["p_img51.png"], "Women", "Winterwear", ["S", "M", "L", "XL"], false],
    ["Men Slim Fit Relaxed Denim Jacket", 350, ["p_img52.png"], "Men", "Winterwear", ["S", "M", "L", "XL"], false],
];

const run = async () => {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected. Starting upload of", demoProducts.length, "products...");

    let count = 0;
    for (const [name, price, filenames, category, subCategory, sizes, bestseller] of demoProducts) {
        try {
            const imageUrls = [];
            for (const filename of filenames) {
                const filePath = path.join(ASSETS_DIR, filename);
                const result = await cloudinary.uploader.upload(filePath, { resource_type: 'image' });
                imageUrls.push(result.secure_url);
            }

            const product = new productModel({
                name,
                description: desc,
                price,
                image: imageUrls,
                category,
                subCategory,
                sizes,
                bestseller,
                date: Date.now(),
            });

            await product.save();
            count++;
            console.log(`[${count}/${demoProducts.length}] Added: ${name}`);
        } catch (err) {
            console.error(`Failed to add "${name}":`, err.message);
        }
    }

    console.log(`Done. ${count} products added.`);
    await mongoose.disconnect();
    process.exit(0);
};

run().catch((err) => {
    console.error("Seed script failed:", err);
    process.exit(1);
});