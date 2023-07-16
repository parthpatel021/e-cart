import React,{ useState, useEffect } from 'react'
import Layout from '../Components/Layout/Layout'
import axios from 'axios';
import toast from "react-hot-toast";
import { Checkbox, Radio } from 'antd';
import { Prices } from '../Components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setToatl] = useState(0);
    const [page,setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const [cart,setCart] = useCart();

    // get all products
    const getAllProducts = async () => {
        try {
            setLoading(true);
            const {data} = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`)
            
            setLoading(false);
            setProducts(data.products);

        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error('Something Went Wrong');
        }
    }

    //get All categories
    const getAllCategories = async () => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/category/get-category`);
            if(data?.success){
                setCategories(data?.category);
            }

        } catch (error) {
            console.log(error);
            toast.error('Something went wrong in getting category')
        }
    };

    // get Total count
    const getTotal = async () => {
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-count`);
            setToatl(data?.total);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(page === 1) return;
        loadMore();
    },[page])
    // Load More
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/product-list/${page}`);

            setLoading(false);
            setProducts([ ...products, ...data.products])
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    //Filter by Category
    const handleFilter = (value, id) => {
        let all = [...checked];

        if(value){
            all.push(id);
        } else {
            all = all.filter(c => c !== id);
        }

        setChecked(all);
    }

    //lifecycle method
    useEffect(() => {
        if(!checked.length || !radio.length) getAllProducts();
        getAllCategories();
        getTotal();
    }, [checked.length , radio.length]);

    useEffect(() => {
        if(checked.length || radio.length) filterProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[checked, radio]);

    // get filtered product
    const filterProduct = async () => {
        try {
            const {data} = await axios.post(`${process.env.REACT_APP_API}/api/v1/product/product-filters`, 
                { checked, radio } 
            );

            console.log(data);
            setProducts(data?.products);    


        } catch (error) {
            console.log(error);
        }
    }


    return (
        <Layout title={'All Products - Best Offers'}>
            <div className='row mt-3'>
                {/* FIlters */}
                <div className='col-md-2 m-3'>
                    
                    {/* Category Filter */}
                    <h4 className='text-center'>Filter By Category</h4>
                    <div className='d-flex flex-column'>
                        {categories?.map(c => (
                            <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)} >
                                {c.name}
                            </Checkbox>
                        ))}
                    </div>

                    {/* Price Filter */}
                    <h4 className='text-center mt-4'>Filter By Price</h4>
                    <div className='d-flex flex-column'>
                        <Radio.Group onChange={e => setRadio(e.target.value)}>
                            {Prices?.map(p => (
                                <div key={p._id}>
                                    <Radio value={p.array}>{p.name}</Radio>
                                </div>
                            ))}
                        </Radio.Group>
                    </div>

                    <div className='d-flex flex-column mt-3'>
                        <button className='btn btn-danger' onClick={() => window.location.reload()}>
                            Reset Filters
                        </button>
                    </div>
                </div>

                {/* ALL Products */}
                <div className='col-md-9'>
                    <h1 className='text-center'>All Products</h1>
                    <div className='d-flex flex-wrap'>
                        {/* Product Card */}
                        {products?.map(p => (
                            <div className="card m-2" style={{width: '18rem'}} key={p.name}>
                                <img 
                                 src={`${process.env.REACT_APP_API}/api/v1/product/product-photo/${p._id}`} 
                                    className="card-img-top" 
                                    alt={p.name} 
                                />
                                <div className="card-body">
                                    <h5 className="card-title">{p.name} </h5>
                                    <p className="card-text">
                                        {p.description.substring(0,30)+"..."}
                                    </p>
                                    <p className='card-text'>₹ {p.price}</p>
                                    <button 
                                        className='btn btn-primary ms-1'
                                        onClick={() => navigate(`/product/${p.slug}`)}    
                                    >More Details</button>
                                    <button 
                                        className='btn btn-secondary ms-1'
                                        onClick={() => {
                                            setCart([...cart,p]);
                                            localStorage.setItem('cart', JSON.stringify([...cart,p]))
                                            toast.success('Item Added to Cart')
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                        
                    </div>

                    <div className='m-2 p-3'>
                        {products && products.length < total && (
                            <button 
                                className='btn btn-warning' 
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage(page+1);
                                }}
                            >
                                {loading ? 'Loading...': 'Load More'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;