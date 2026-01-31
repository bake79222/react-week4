import { useEffect, useRef, useState } from 'react';
import axios from "axios";
import "./assets/style.css";
import 'bootstrap/dist/css/bootstrap.min.css'; // 必須要有這一行
import * as bootstrap from "bootstrap";
import ProductModal from "./components/ProductModal";
import Pagination from "./components/Pagination"; // <--- 新增這一行
import Login from './views/Login';

const API_BASE = import.meta.env.VITE_API_BASE;
const API_PATH = import.meta.env.VITE_API_PATH;
const INITIAL_TEMPLATE_DATA = {
  id: "",
  title: "",
  category: "",
  origin_price: "",
  price: "",
  unit: "",
  description: "",
  content: "",
  is_enabled: false,
  imageUrl: "",
  imagesUrl: [],
  size:"",
};
function App() {
  // 
  const productModalRef = useRef(null);


  // 表單資料狀態

  //登入狀態管理
  const [isAuth,setIsAuth] = useState(false);

  const [products, setProducts] = useState([]);
  const [modalType, setModalType] = useState(""); // "create", "edit", "delete"
  const [templateProduct, setTemplateProduct] = useState(INITIAL_TEMPLATE_DATA);
  const [pagination,setPagination] = useState({});
  


  const getProducts = async (page = 1)=>{
    try {
      const response = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products?page=${page}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log(error.response) 
    }
  };






  

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    if (token){
      axios.defaults.headers.common['Authorization'] = token;
    }
    
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false});
      // Modal 關閉時移除焦點
    document
      .querySelector("#productModal")
      .addEventListener("hide.bs.modal", () => {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      });

    const  checkLogin  =async () =>{
      try {
        const response = await axios.post(`${API_BASE}/api/user/check`);
        console.log(response.data);
        setIsAuth(true);
        getProducts(); // 載入產品資料
      } catch (error) {
        console.log("權限檢查失敗：", error.response?.data?.message);
        setIsAuth(false);
      }
    }

    checkLogin();
  },[]);

    const openModal = (type,product) => {
      setModalType(type);
      setTemplateProduct((pre) => ({
        ...INITIAL_TEMPLATE_DATA,...product,
      }));
      productModalRef.current.show();
    };

    const closeModal = () => {
      productModalRef.current.hide();
    };

  return (
    <>
    {
      !isAuth ?(      
        <Login getProducts={getProducts} setIsAuth={setIsAuth}/>):(
        <div className='container'>
          <h2 className="mt-4">產品列表</h2>
            <div className="text-end mt-4 mb-4">
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() => openModal("create",INITIAL_TEMPLATE_DATA)}>
                建立新的產品
              </button>
            </div>
          <table className="table table-striped ">
              <thead>
                  <tr>
                  <th scope="col" className='bg-success text-white border '>分類</th>
                  <th scope="col" className='bg-success text-white border '>產品名稱</th>
                  <th scope="col" className='bg-success text-white border '>原價</th>
                  <th scope="col" className='bg-success text-white border'>售價</th>
                  <th scope="col" className='bg-success text-white border'>是否啟用</th>
                  <th scope="col" className='bg-success text-white border'>編輯</th>
                  </tr>
              </thead>
              <tbody>
                  {
                      products.map((product) => (
                      <tr key={product.id}>  
                        <td>{product.category}</td>
                        <th scope="row">{product.title}</th>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td className={`${product.is_enabled ? 'text-success' : ''}`}>
                            {product.is_enabled ? '啟用' : '未啟用'}</td>
                        <td>
                          <div className="btn-group" role="group" aria-label="Basic outlined example">
                            <button type="button" className="btn btn-outline-primary btn-sm" onClick={() => openModal("edit",product)}>編輯</button>
                            <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => openModal("delete",product)}>刪除</button>
                          </div>
                        </td>
                      </tr>
                  ))}
              </tbody>
          </table>
          <Pagination pagination={pagination} onChangePage={getProducts}/>
        </div>
      )
    }
    <ProductModal 
      modalType ={modalType}
      templateProduct ={templateProduct}
      getProducts={getProducts}
      closeModal ={closeModal}
      />

    </>
  )
}

export default App
