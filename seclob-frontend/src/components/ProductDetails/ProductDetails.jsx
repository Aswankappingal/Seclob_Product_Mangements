import './ProductDetails.scss'
import ScrollToTopOnMount from '../ScrollTopMount'
import Navbar from '../Navbar/Navbar'
import Breadcrumb from '../BreadCrumb/BreadCrumb';
import { IoCheckmarkOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { IoIosHeartEmpty } from 'react-icons/io';
import useProductInnerDetails from '../../redux/hooks/productdetailsHooks/useFetchProductDetails';
import axios from 'axios';
import backendUrl from '../../backendUrl';
import useFtechAllSubCategory from '../../redux/hooks/HomePageHooks/useFtechAllSubCategory';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const ProductDetails = () => {
    const [quantity, setQuantity] = useState(1);
    const [selectedVariant, setSelectedVariant] = useState(0);
    const [mainImage, setMainImage] = useState(0);
    const [addProductModalIsOpen, setAddProductModalIsOpen] = useState(false);
    const { productId } = useParams()


    const increment = () => {
        setQuantity(prev => prev + 1);
    };

    const decrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };
    const { productInnerDetails, status, error,refetch } = useProductInnerDetails();
    const { subCategories, status: subCategoryStatus, error: subcategoryError, refetchSubCategories } = useFtechAllSubCategory()

    const [formData, setFormData] = useState({
        title: '',
        code: '',
        description: '',
        subcategory: '',
        variants: [{ ram: '', price: '', QTY: '' }],
        images: []
    });
    useEffect(() => {
        if (productInnerDetails) {
            setFormData({
                title: productInnerDetails.title || '',
                code: productInnerDetails.code || '',
                description: productInnerDetails.description || '',
                subcategory: productInnerDetails.subcategory || '',
                variants: productInnerDetails.variants || [{ ram: '', price: '', QTY: '' }],
                images: productInnerDetails.images ||[]
            });
        }
    }, [productInnerDetails]);
    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (formData.images.length + files.length > 2) {
            alert('Maximum 2 images allowed');
            return;
        }

        const base64Images = await Promise.all(
            files.map(async (file) => await convertToBase64(file))
        );

        setFormData({
            ...formData,
            images: [...base64Images]
        });
    };
    const handleSubmit = async () => {
        try {
            const response = await axios.patch(`${backendUrl}/artifitia/update-product/${productId}`, formData);
            if (response.data) {
                toast('Product Updated successfully');
                setFormData({
                    title: '',
                    code: '',
                    description: '',
                    subcategory: '',
                    variants: [{ ram: '', price: '', QTY: '' }],
                    images: []
                });
               setAddProductModalIsOpen(false);
               refetch()
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add product');
        }
    };
    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [...formData.variants, { ram: '', price: '', QTY: '' }]
        });
    };

    const handleVariantSelection = (index) => {
        setSelectedVariant(index);
    };

    const handleVariantEdit = (index, field, value) => {
        const updatedVariants = formData.variants.map((variant, i) => {
            if (i === index) {
                return { ...variant, [field]: value };
            }
            return variant;
        });
        setFormData({
            ...formData,
            variants: updatedVariants
        });
    };

    const removeImage = (index) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index)
        });
    };

    const items = [
        { label: 'Home', path: '/' },
        { label: 'Product Details' },
    ];



    const handleVariantChange = (index) => {
        setSelectedVariant(index);
    };

    const handleImageChange = (index) => {
        setMainImage(index);
    };
    if (status == 'loading') {
        return <div>
             <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        </div>
    }
    return (
        <div className='productdetailsMainWrapper'>
            <ScrollToTopOnMount />
            <Navbar />
            <ToastContainer
                            position="top-right"
                            autoClose={3000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                        />
            {
                //Add Product Modal
                addProductModalIsOpen && (
                    <div className="add-category-overlay">
                        <div className="add-prod-modal">
                            <h3>Update Product</h3>
                            <table>
                                <tbody>
                                    <tr className="productname-section">
                                        <td className="table-key">Title:</td>
                                        <td className="table-valus">
                                            <input
                                                type="text"
                                                placeholder="Enter Product Name"
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            />
                                        </td>
                                    </tr>

                                    <tr className="productname-section">
                                        <td className="table-key">Code:</td>
                                        <td className="table-valus">
                                            <input
                                                type="text"
                                                placeholder="Enter Code"
                                                value={formData.code}
                                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            />
                                        </td>
                                    </tr>

                                
                                    {formData.variants.map((variant, index) => (
                                    <tr key={index} className="variants-row">
                                        <td className="table-key key-variance">
                                            {index === 0 ? 'Variants:' : ''}
                                        </td>
                                        <td className="variance-data">
                                            <div className="variance-details">
                                                <span>Ram:</span>
                                                <input
                                                    type="text"
                                                    value={variant.ram}
                                                    onChange={(e) => handleVariantEdit(index, 'ram', e.target.value)}
                                                />
                                                <span>Price:</span>
                                                <input
                                                    type="number"
                                                    value={variant.price}
                                                    onChange={(e) => handleVariantEdit(index, 'price', e.target.value)}
                                                />
                                                <span>QTY:</span>
                                                <input
                                                    type="number"
                                                    value={variant.QTY}
                                                    onChange={(e) => handleVariantEdit(index, 'QTY', e.target.value)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                    <tr>
                                        <td></td>
                                        <td>
                                            <button className="add-variance-btn" onClick={addVariant}>
                                                Add Variant
                                            </button>
                                        </td>
                                    </tr>

                                    <tr className="productname-section">
                                        <td className="table-key">Sub category:</td>
                                        <td className="table-valus">
                                            <select
                                                value={formData.subcategory}
                                                onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                                            >
                                                <option value="" disabled>Select Sub Category</option>
                                                {subCategories.map((data, index) => (
                                                    <option key={index} value={data.sub_category_name}>
                                                        {data.sub_category_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>

                                    <tr className="productname-section">
                                        <td className="table-key">Description:</td>
                                        <td className="table-valus">
                                            <input
                                                type="text"
                                                placeholder="Enter Product Description"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            />
                                        </td>
                                    </tr>

                                    <tr className="productname-section">
                                        <td className="table-key">Upload image:</td>
                                        <td className="table-valus">
                                            <div className="selected-images">
                                                {formData.images.map((image, index) => (
                                                    <div key={index} className="image-container">
                                                        <img src={image} alt={`Product ${index + 1}`} />
                                                        <button
                                                            className="remove-image"
                                                            onClick={() => removeImage(index)}
                                                        >×</button>
                                                    </div>
                                                ))}
                                                {formData.images.length < 5 && (
                                                    <div
                                                        className="upload-image"
                                                        onClick={() => document.getElementById("imageUpload").click()}
                                                    >
                                                        <img src="/images/uploadimage.png" alt="upload" />
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    id="imageUpload"
                                                    accept="image/*"
                                                    multiple
                                                    style={{ display: "none" }}
                                                    onChange={handleImageUpload}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="buttons">
                                <button className="addProd" onClick={handleSubmit}>UPDATE</button>
                                <button onClick={() => setAddProductModalIsOpen(false)} className="discartProd">DISCARD</button>
                            </div>
                        </div>
                    </div>
                )
            }
            <div className="details-wrapper">
                <div className="row">
                    <div className="col-lg-4 details-left">
                        <Breadcrumb items={items} />
                        <div className="main-image">
                            <img src={productInnerDetails?.images?.[mainImage]} alt="Product Main" />
                        </div>
                        <div className="row">
                            {productInnerDetails?.images?.map((image, index) => (
                                <div className="col-lg-6 col-6" key={index}>
                                    <div
                                        className="child-image"
                                        onClick={() => handleImageChange(index)} // Change main image on click
                                    >
                                        <img src={image} alt={`Product ${index + 1}`} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-lg-8 details-right">
                        <div className="product-details">
                            <h2 className="product-title">{productInnerDetails?.title}</h2>
                            <p>{productInnerDetails?.description}</p>
                            <h5 className="price">${productInnerDetails?.variants?.[selectedVariant].price}</h5>
                            <p>
                                <span className='availability'>Availability :</span>
                                <span className='stock-status'>
                                    <IoCheckmarkOutline />
                                    {productInnerDetails?.variants?.[selectedVariant].QTY > 0 ? "In stock" : (<span style={{color:"red"}}>Out Of Stock</span>)}
                                </span>
                            </p>
                            <p className="stock-count-text">
                                Hurry up! Only {productInnerDetails?.variants?.[selectedVariant].QTY} products left in stock!
                            </p>
                        </div>
                        <div className="variant-details">
                            <div className="ram-section">
                                <span>Ram: </span>
                                {productInnerDetails?.variants?.map((variant, index) => (
                                    <div
                                        key={index}
                                        className={`ram-item ${selectedVariant === index ? 'active-ram' : ''}`}
                                        onClick={() => handleVariantChange(index)}
                                    >
                                        {variant?.ram}
                                    </div>
                                ))}
                            </div>
                            <div className="qty-counter">
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "2rem" }}>
                                    <span>Quantity:</span>
                                    <button
                                        onClick={decrement}
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "5px 10px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="text"
                                        value={quantity}
                                        readOnly
                                        style={{
                                            width: "40px",
                                            textAlign: "center",
                                            border: "1px solid #ccc",
                                            padding: "5px",
                                        }}
                                    />
                                    <button
                                        onClick={increment}
                                        style={{
                                            border: "1px solid #ccc",
                                            padding: "5px 10px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="button-section">
                                <Link><button onClick={() => setAddProductModalIsOpen(true)}>Edit product</button></Link>
                                <button>Buy it now</button>
                                <div className="wishlist">
                                    <IoIosHeartEmpty className='heart-icon' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails
