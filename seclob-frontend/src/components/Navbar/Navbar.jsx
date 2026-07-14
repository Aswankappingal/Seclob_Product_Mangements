import { IoIosHeartEmpty } from 'react-icons/io'
import './Navbar.scss'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineHeart, AiOutlineShoppingCart } from 'react-icons/ai'
import UseLoginedUser from '../../redux/hooks/useLoginedUser'
import { useState, useEffect, useRef } from 'react'
import { OffcanvasProvider, Trigger, Offcanvas } from 'react-simple-offcanvas'
import useFetchAllProduct from '../../redux/hooks/HomePageHooks/useFetchAllProduct'
import { FaAngleRight, FaStar } from 'react-icons/fa'
import { BsChevronRight } from 'react-icons/bs'
import { RiCloseCircleLine } from 'react-icons/ri'
import { useDispatch } from 'react-redux'
import { fetchLoginedUser } from '../../redux/slices/loginedUserSlice'
import axios from 'axios'
import backendUrl from '../../backendUrl'

const Navbar = () => {
    const navigate = useNavigate()
    const { loginedUser, status, error, isAuthTokenPresent } = UseLoginedUser()
    const dispatch = useDispatch()
    const [logoutModalIsOpen, setLogoutModalIsOpen] = useState(false)

    const handleRemoveFromWishlist = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const response = await axios.post(
                `${backendUrl}/seclob/wishlist/toggle`,
                { productId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data) {
                dispatch(fetchLoginedUser());
            }
        } catch (error) {
            console.error("Error removing from wishlist:", error);
        }
    };
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [filteredProducts, setFilteredProducts] = useState([])
    const { AllProducts, status: fetchAllProductStatus, error: fetchAllProductError } = useFetchAllProduct()
    const searchContainerRef = useRef(null)

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredProducts(AllProducts || [])
        } else {
            const filtered = AllProducts?.filter(product =>
                product.title.toLowerCase().includes(searchQuery.toLowerCase())
            ) || []
            setFilteredProducts(filtered)
        }
    }, [searchQuery, AllProducts])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setShowSearchResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        const matchingProducts = query.trim() === "" ? [] :
            AllProducts?.filter(product =>
                product.title.toLowerCase().includes(query.toLowerCase())
            ) || [];

        setFilteredProducts(matchingProducts);
        setShowSearchResults(query.trim() !== "");
    };

    const handleProductClick = (productId) => {
        setShowSearchResults(false)
        setSearchQuery('')
        navigate(`/product-details/${productId}`)
    }

    const handeLogoutModal = () => {
        setLogoutModalIsOpen(true)
    }

    const handeClosetModal = () => {
        setLogoutModalIsOpen(false)
    }

    const handleLogout = () => {
        localStorage.clear()
        window.location.href = '/signin'
    }

    return (
        <div className='navbarmainWrapper'>
            <div className="deskTopNav">
                <div className="navigaton-bar">
                    <div className="nav-container">
                        <div className="nav-right">
                            <Link>
                                <div className='wishlist' data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample">
                                    <IoIosHeartEmpty className='heart-icon' />
                                    <div className="count">{loginedUser?.wishlist?.length || 0}</div>
                                </div>
                            </Link>
                            {/* ofcanvas-section */}
                            <div className="ofcanvasMain">
                                <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                                    <div className="offcanvas-header">
                                        <div className="items-wrapper">
                                            <div className='wishlist'><AiOutlineHeart className='heart-icon' /></div>
                                            <div className='items'>Items</div>
                                        </div>
                                        <BsChevronRight data-bs-dismiss="offcanvas" aria-label="Close" className='right-angle' />
                                    </div>
                                    <div className="offcanvas-body">
                                        {loginedUser?.wishlist && loginedUser.wishlist.length > 0 ? (
                                            loginedUser.wishlist.map((item) => (
                                                <div className="product-details-wrapper" key={item._id} style={{ position: 'relative' }}>
                                                    <RiCloseCircleLine 
                                                        className='close-icon' 
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveFromWishlist(item._id);
                                                        }} 
                                                    />
                                                    <div className="product-details" data-bs-dismiss="offcanvas" style={{ cursor: 'pointer' }} onClick={() => handleProductClick(item._id)}>
                                                        <div className="product-details-left">
                                                            <div className="product-image">
                                                                <img src={item.images?.[0]} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                                                            </div>
                                                        </div>
                                                        <div className="product-details-right">
                                                            <h2 className="product-title">{item.title}</h2>
                                                            <h3 className="product-price">${item.variants?.[0]?.price}</h3>
                                                            <div className="stars">
                                                                <FaStar className='star-icon' />
                                                                <FaStar className='star-icon' />
                                                                <FaStar className='star-icon' />
                                                                <FaStar className='star-icon' />
                                                                <FaStar className='star-icon' />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
                                                Your wishlist is empty
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="signin">
                                {loginedUser ? (
                                    <span onClick={handeLogoutModal} style={{ color: "white" }}>{loginedUser.name}</span>
                                ) : (
                                    <Link to='/signin'>Sign in</Link>
                                )}
                            </div>
                            <Link>
                                <div className="cart">
                                    <div className="cart-icon-wrapper">
                                        <AiOutlineShoppingCart className='cart-icon' />
                                        <div className='count'>0</div>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="nav-left">
                            <div className="search-bar-container" ref={searchContainerRef}>
                                <div className="search-bar">
                                    <div className="search-left">
                                        <input
                                            type="text"
                                            placeholder='Search products by title'
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />
                                    </div>
                                    <div className="search-right">
                                        <button>Search</button>
                                    </div>
                                </div>
                                {showSearchResults && (
                                    <div className="search-results-container">
                                        {filteredProducts.length > 0 ? (
                                            filteredProducts.map(product => (
                                                <div
                                                    key={product._id}
                                                    className="search-result-item"
                                                    onClick={() => handleProductClick(product._id)}
                                                >
                                                    <div className="result-info">
                                                        <span className="result-name">{product.title}</span>
                                                        <span className="result-price">${product.price}</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="no-results" style={{ textAlign: "center", margin: "1rem" }}>No products found</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {logoutModalIsOpen && (
                <div className="modal-overLay">
                    <div className="logoutModal">
                        <h3>Are You Sure Want To Logout ?</h3>
                        <div className="row">
                            <div className="col-lg-6">
                                <button onClick={handleLogout} className='logout-btn'>Logout</button>
                            </div>
                            <div className="col-lg-6">
                                <button onClick={handeClosetModal} className='close-btn'>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar