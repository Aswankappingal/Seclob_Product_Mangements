import { Link } from 'react-router-dom';
import Breadcrumb from '../BreadCrumb/BreadCrumb';
import Navbar from '../Navbar/Navbar'
import { Accordion } from 'react-bootstrap-accordion';
import 'react-bootstrap-accordion/dist/index.css';
import ScrollToTopOnMount from '../ScrollTopMount'
// import SideBar from '../SideBar/SideBar';
import './HomePage.scss'
import { useEffect, useState } from 'react';
import useAddCategory from '../../redux/hooks/HomePageHooks/useAddCategory';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useFetchCategories from '../../redux/hooks/HomePageHooks/useFetchCategory';
// import useFetchSubCategory from '../../redux/hooks/HomePageHooks/usefetchSubCategory';
import useFtechAllSubCategory from '../../redux/hooks/HomePageHooks/useFtechAllSubCategory';
import axios from 'axios';
import backendUrl from '../../backendUrl';
import { IoHeartOutline } from 'react-icons/io5';
import { FaStar } from 'react-icons/fa';
import useFetchAllProduct from '../../redux/hooks/HomePageHooks/useFetchAllProduct';
import ImageCropper from '../ImageCropper';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const HomePage = () => {
    const [selectedSubCategories, setSelectedSubCategories] = useState([]);


    const [addProdLoading, setAddProdLoading] = useState(false)
    const [addCatModalIsOpen, setAddCatModalIsOpen] = useState(false);
    const [addSubCatModalIsOpen, setAddSubCatModalIsOpen] = useState(false);
    const [addProductModalIsOpen, setAddProductModalIsOpen] = useState(false);
    const [addSubCateLoading, setAddSubCatLoading] = useState(false)
    const [categoryName, setCategoryName] = useState('');
    const [parentcategoryId, setParentcategoryId] = useState('');
    const [subcategory, setSubcategory] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        code: '',
        description: '',
        subcategory: '',
        variants: [{ ram: '', price: '', QTY: '' }],
        images: []
    });
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

        for (let i = 0; i < files.length; i++) {
            const base64Image = await convertToBase64(files[i]);
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, base64Image]
            }));
        }
    };

    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [...formData.variants, { ram: '', price: '', QTY: '' }]
        });
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = formData.variants.map((variant, i) => {
            if (i === index) {
                return { ...variant, [field]: value };
            }
            return variant;
        });
        setFormData({ ...formData, variants: updatedVariants });
    };

    const removeImage = (index) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index)
        });
    };


    const { loading, error, successMessage, handleAddCategory } = useAddCategory();
    const items = [
        { label: 'Home', path: '/' },
    ];

    const OppenAddCatModal = () => {
        setAddCatModalIsOpen(true)
    }
    const closeCatModal = () => {
        setAddCatModalIsOpen(false)
    }
    const OppenAddSubCatModal = () => {
        setAddSubCatModalIsOpen(true)
    }
    const closeSubCatModal = () => {
        setAddSubCatModalIsOpen(false)
    }
    const OppenAddProductModal = () => {
        setAddProductModalIsOpen(true)
    }
    const closeProductModal = () => {
        setAddProductModalIsOpen(false)
    }
    const { categories, status: categoryStatus, error: fetchCategoryError, refetchCategories } = useFetchCategories();
    const { subCategories, status: subCategoryStatus, error: subcategoryError, refetchSubCategories } = useFtechAllSubCategory()
    const { AllProducts, status: fetchAllProductStatus, error: fetchAllProductError, refetch: refetchAllProducts } = useFetchAllProduct()
    //filter with brands
    const handleSubCategoryChange = (subCategoryId) => {
        setSelectedSubCategories((prevSelected) =>
            prevSelected.includes(subCategoryId)
                ? prevSelected.filter((id) => id !== subCategoryId) // Uncheck
                : [...prevSelected, subCategoryId] // Check
        );
    };
    const filteredProducts = selectedSubCategories.length > 0
        ? AllProducts.filter((product) =>
            selectedSubCategories.includes(product.subcategory)
        )
        : AllProducts;

    //filter with brands;
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 4;

    const lastIndex = currentPage * productsPerPage;
    const firstIndex = lastIndex - productsPerPage;
    const currentProducts = filteredProducts.slice(firstIndex, lastIndex);
    const totalProducts = AllProducts.length;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const renderPaginationNumbers = () => {
        const pages = [];

        pages.push(
            <button
                key={1}
                onClick={() => setCurrentPage(1)}
                className={`pagination-number ${currentPage === 1 ? 'active' : ''}`}
            >
                1
            </button>
        );

        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        if (startPage > 2) {
            pages.push(<span key="dots1" className="pagination-dots">...</span>);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`pagination-number ${currentPage === i ? 'active' : ''}`}
                >
                    {i}
                </button>
            );
        }

        if (endPage < totalPages - 1) {
            pages.push(<span key="dots2" className="pagination-dots">...</span>);
        }

        if (totalPages > 1) {
            pages.push(
                <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className={`pagination-number ${currentPage === totalPages ? 'active' : ''}`}
                >
                    {totalPages}
                </button>
            );
        }

        return pages;
    };



    const handleAdd = async () => {
        if (categoryName.trim()) {
            try {
                const response = await handleAddCategory(categoryName);
                if (!error) {
                    toast.success('Category added successfully!');
                    setCategoryName('');
                    setAddCatModalIsOpen(false)
                    refetchCategories()
                    refetchSubCategories()
                }
            } catch (err) {
                // No need to show toast here since error will be handled by redux state
            }
        } else {
            toast.error('Please enter a valid category name.');
        }
    };

    const addSubCategory = async (e) => {
        setAddSubCatLoading(true)
        e.preventDefault()
        try {
            const responce = await axios.post(`${backendUrl}/artifitia/add-sub-category`, {
                parent_category: parentcategoryId,
                sub_category_name: subcategory
            })
            if (responce) {
                toast.success('Category added successfully!');
                setAddSubCatModalIsOpen(false)
                setParentcategoryId('')
                setSubcategory('')
                refetchSubCategories()
            }

        } catch (error) {
            console.log(error);
        } finally {
            setAddSubCatLoading(false)
        }
    }

    const handleSubmit = async () => {
        if (!formData.title || !formData.code || !formData.subcategory || !formData.description) {
            return toast.error("Please fill in all basic product details.");
        }
        for (let i = 0; i < formData.variants.length; i++) {
            const v = formData.variants[i];
            if (!v.ram || !v.price || !v.QTY) {
                return toast.error(`Please fill in all details (Ram, Price, QTY) for variant ${i + 1}.`);
            }
        }
        if (formData.images.length === 0) {
            return toast.error("Please upload at least one product image.");
        }

        setAddProdLoading(true)
        try {
            const response = await axios.post(`${backendUrl}/artifitia/add-product`, formData);
            if (response.data) {
                toast.success('Product added successfully');
                setFormData({
                    title: '',
                    code: '',
                    description: '',
                    subcategory: '',
                    variants: [{ ram: '', price: '', QTY: '' }],
                    images: []
                });
                setAddProductModalIsOpen(false);
                refetchAllProducts()
            }
        } catch (error) {
            console.error('Error adding product:', error);
            const errorMessage = error.response?.data?.error || 'Failed to add product';
            toast.error(errorMessage);
        } finally {
            setAddProdLoading(false)
        }
    };


    if (categoryStatus == 'loading' || subCategoryStatus == 'loading' || fetchAllProductStatus == 'loading') {
        return <div>
            <Box sx={{ width: '100%' }}>
                <LinearProgress />
            </Box>
        </div>
    }
    if (categoryStatus == "failed") {
        return <div>{fetchCategoryError}</div>
    }
    if (subCategoryStatus == "failed") {
        return <div>{subcategoryError}</div>
    }
    if (fetchAllProductStatus == "failed") {
        return <div>{fetchAllProductError}</div>
    }
    return (
        <div className='HomePageMainWrapper'>
            <ScrollToTopOnMount />
            <Navbar />
            <div className={`home`}>
                <div className="top-section row">
                    <div className="col-lg-6 top-left">
                        <Breadcrumb items={items} />
                    </div>
                    <div className="col-lg-6 top-right">  <div className="detail-right">
                        <div><button className='filter-btn' type="button" data-bs-toggle="offcanvas" data-bs-target="#filterCanavas" aria-controls="filterCanavas">Filter</button></div>
                        <div><Link><button onClick={OppenAddCatModal}>Add category</button></Link></div>
                        <div><Link><button onClick={OppenAddSubCatModal}>Add sub category</button></Link></div>
                        <div><Link><button onClick={OppenAddProductModal}>Add product</button></Link></div>
                    </div></div>
                </div>

                <div className="home-details">
                    {/* filter-ofcanvas */}
                    <div className="filterOffCanvasMaiWrapper">
                        <div className="offcanvas offcanvas-start" tabIndex="-1" id="filterCanavas" aria-labelledby="offcanvasExampleLabel">
                            <div className="offcanvas-header">

                                <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                            </div>
                            <div className="offcanvas-body">
                                <div className="sidebar desktop">
                                    <h5>Categories</h5>
                                    <h6>All categories</h6>
                                    <div className="accordian-section">
                                        {categories?.length > 0 ? (
                                            categoryStatus === 'succeeded' && categories?.length > 0 ? (
                                                categories.map((category) => (
                                                    <Accordion
                                                        key={category._id} // Assuming each category has a unique id
                                                        title={category.category_name}
                                                        show={false}
                                                    >
                                                        {/* Ensure subCategories is an array */}
                                                        {subCategoryStatus === 'succeeded' &&
                                                            Array.isArray(subCategories) &&
                                                            subCategories.filter((subCategory) => subCategory.parent_category === category._id).length > 0 ? (
                                                            subCategories
                                                                .filter((subCategory) => subCategory.parent_category === category._id)
                                                                .map((subCategory) => (
                                                                    <div className="checkbox-wrapper" key={subCategory._id}>
                                                                        <input
                                                                            data-bs-dismiss="offcanvas" aria-label="Close"
                                                                            type="checkbox"
                                                                            id={`sub-${subCategory._id}`}
                                                                            onChange={() => handleSubCategoryChange(subCategory.sub_category_name)}
                                                                            checked={selectedSubCategories.includes(subCategory.sub_category_name)}
                                                                        />
                                                                        <label htmlFor={`sub-${subCategory._id}`}>{subCategory.sub_category_name}</label>
                                                                    </div>

                                                                ))
                                                        ) : (
                                                            <p>No subcategories available.</p>
                                                        )}
                                                    </Accordion>
                                                ))
                                            ) : (
                                                <p>No categories available.</p>
                                            )
                                        ) : (
                                            <p>No Categories found</p>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* filter-ofcanvas */}
                    <div className="detail-left">
                        {/* deskTopSideBar */}
                        <div className="sideBarMainWrapper desktopSideBar">
                            <div className="sidebar desktop">
                                <h5>Categories</h5>
                                <h6>All categories</h6>
                                <div className="accordian-section">
                                    {categories?.length > 0 ? (
                                        categoryStatus === 'succeeded' && categories?.length > 0 ? (
                                            categories.map((category) => (
                                                <Accordion
                                                    key={category._id} // Assuming each category has a unique id
                                                    title={category.category_name}
                                                    show={false}
                                                >
                                                    {/* Ensure subCategories is an array */}
                                                    {subCategoryStatus === 'succeeded' &&
                                                        Array.isArray(subCategories) &&
                                                        subCategories.filter((subCategory) => subCategory.parent_category === category._id).length > 0 ? (
                                                        subCategories
                                                            .filter((subCategory) => subCategory.parent_category === category._id)
                                                            .map((subCategory) => (
                                                                <div className="checkbox-wrapper" key={subCategory._id}>
                                                                    <input
                                                                        type="checkbox"
                                                                        id={`sub-${subCategory._id}`}
                                                                        onChange={() => handleSubCategoryChange(subCategory.sub_category_name)}
                                                                        checked={selectedSubCategories.includes(subCategory.sub_category_name)}
                                                                    />
                                                                    <label htmlFor={`sub-${subCategory._id}`}>{subCategory.sub_category_name}</label>
                                                                </div>

                                                            ))
                                                    ) : (
                                                        <p>No subcategories available.</p>
                                                    )}
                                                </Accordion>
                                            ))
                                        ) : (
                                            <p>No categories available.</p>
                                        )
                                    ) : (
                                        <p>No Categories found</p>
                                    )}
                                </div>

                            </div>
                        </div>
                        {/* deskTopSideBar */}

                    </div>
                    <div className="detail-right">
                        {addCatModalIsOpen && (
                            <div className="add-category-overlay">
                                <div className="add-category-model">
                                    <h2>Add Category</h2>

                                    {/* Input for Category Name */}
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Enter category name"
                                            value={categoryName}
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            disabled={loading}
                                            required
                                        />
                                    </div>

                                    {/* Buttons */}
                                    <div className="buttons">
                                        <button className="add" onClick={handleAdd} disabled={loading}>
                                            {loading ? 'Adding...' : 'ADD'}
                                        </button>
                                        <button onClick={closeCatModal} className="discard" disabled={loading}>
                                            DISCARD
                                        </button>
                                    </div>

                                    {/* Feedback Messages */}
                                    {error && <p style={{ color: 'red', marginTop: '10px', textAlign: "center" }}>{error}</p>}
                                    {successMessage && (
                                        <p style={{ color: 'green', marginTop: '10px' }}>{successMessage}</p>
                                    )}
                                </div>
                            </div>

                        )}
                        {/* Toast Container */}
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
                            addSubCatModalIsOpen && (
                                // Add Sub Category Modal
                                <div className="add-category-overlay">
                                    <div className="add-category-model">
                                        <h2>Add Sub Category</h2>
                                        <form action="" onSubmit={addSubCategory}>
                                            <select name="" id="" onChange={(e) => setParentcategoryId(e.target.value)}>
                                                <option value="" disabled selected>
                                                    Select Category
                                                </option>
                                                {categories?.map((data) => (
                                                    <option key={data._id} value={data._id}>{data.category_name}</option>
                                                ))}
                                            </select>

                                            <div><input type="text" placeholder='Enter sub category name' onChange={(e) => setSubcategory(e.target.value)} /></div>
                                            <div className="buttons">
                                                <button className='add' disabled={addSubCateLoading}>{addSubCateLoading ? "ADDING.." : "ADD"}</button>
                                                <button onClick={closeSubCatModal} className='discard'>DISCARD</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>

                            )
                        }
                        {
                            //Add Product Modal
                            addProductModalIsOpen && (
                                <div className="add-category-overlay">
                                    <div className="add-prod-modal">
                                        <h3>Add Product</h3>
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
                                                            placeholder="Enter Code Of Product"
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
                                                                    onChange={(e) => handleVariantChange(index, 'ram', e.target.value)}
                                                                />
                                                                <span>Price:</span>
                                                                <input
                                                                    type="text"
                                                                    value={variant.price}
                                                                    onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                                                                />
                                                                <span>QTY:</span>
                                                                <input
                                                                    type="text"
                                                                    value={variant.QTY}
                                                                    onChange={(e) => handleVariantChange(index, 'QTY', e.target.value)}
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
                                                                style={{ display: "none" }}
                                                                onChange={handleImageUpload}
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div className="buttons">
                                            <button className="addProd" onClick={handleSubmit} disabled={addProdLoading}>{addProdLoading?"ADING...":"ADD"}</button>
                                            <button className="discartProd" onClick={closeProductModal}>DISCARD</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        <div className="product-listing-wrapper">
                            <div className="row">
                                {
                                    currentProducts.length > 0 ? (
                                        currentProducts.map((product, index) => (
                                            <div className="col-lg-3 col-6" key={index}>
                                                <div className="card">
                                                    <div className="wishlist"><IoHeartOutline /></div>
                                                    <Link to={`/product-details/${product._id}`}>
                                                        <div className="prod-details">
                                                            <div className="prod-image">
                                                                <img src={product.images[0]} alt="" />
                                                            </div>
                                                            <div className="price-details">
                                                                <h3 className="prod-title">{product.title}</h3>
                                                                <h6 className="price">${product.variants[0].price}</h6>
                                                                <div className="rating">
                                                                    <FaStar className='star-icon' />
                                                                    <FaStar className='star-icon' />
                                                                    <FaStar className='star-icon' />
                                                                    <FaStar className='star-icon' />
                                                                    <FaStar className='star-icon' />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (<p style={{ textAlign: "center", paddingTop: "3rem" }}>No Products Available</p>)
                                }

                            </div>

                            {/* Pagination */}
                            {
                                AllProducts?.length > 4 ? (
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                        <div className="items-count" style={{ paddingTop: "20px" }}>
                                            {firstIndex + 1}-{Math.min(lastIndex, totalProducts)} of {totalProducts} items
                                        </div>
                                        <div className="pagination-container">
                                            {renderPaginationNumbers()}
                                        </div>
                                        <div style={{ color: "transparent" }}>showyyyyyyy</div>
                                    </div>
                                ) : ""
                            }
                        </div>

                        <style>{`
                .pagination-container {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                    margin-top: 20px;
                }

                .pagination-number {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    background: transparent;
                    color: #666;
                    font-size: 14px;
                }

                .pagination-number:hover {
                    background: #f0f0f0;
                }

                .pagination-number.active {
                    background: #ff9900;
                    color: white;
                }

                .pagination-dots {
                    color: #666;
                }
            `}</style>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default HomePage
