import React,{ useState, useEffect } from 'react'
import Layout from '../Components/Layout/Layout'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CategoryProduct = () => {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if(params?.slug) getProductByCategory();
    },[params?.slug])

    // Get products by category
    const getProductByCategory = async () => {
        try {
            const {data} = await axios.get(
                `${process.env.REACT_APP_API}/api/v1/product/product-category/${params.slug}`);

            setProducts(data?.products);
            setCategory(data?.category);

        } catch (error) {
            console.log(error);

        }
    }

  return (
    <Layout>
        <div className='container mt-3'>
            <h4 className='text-center'>Category - {category?.name}</h4>
            <h6 className='text-center'>{products?.length} result found</h6>
            {/* ALL Products */}
            <div className=''>
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
                                <button className='btn btn-secondary ms-1'>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                    
                </div>

                {/* <div className='m-2 p-3'>
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
                </div>*/}
            </div>
        </div>
    </Layout>
  )
}

export default CategoryProduct