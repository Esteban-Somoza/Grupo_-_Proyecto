const { validationResult } = require('express-validator');
const { write, create, index, find, filter, edit, deleteImage } = require("../models/product.model");
const {producto, image ,information,line,category} = require("../database/models/index")


module.exports = {

  productDetail: async(req, res) => {
  //  let product = find(parseInt(req.params.id))
  let products = await producto.findAll({include:{all:true}})
console.log(producto);
 /*   if (!product) {
      return res.redirect('/product/finder')
    }*/
    if(req.query && req.query.name){
      products = producto.filter(product => product.name.toLowerCase().indexOf(req.query.name.toLowerCase()) > -1)
    }

    return res.render("./products/productDetail", {
      title: producto.name,
      styles: ["style", "header", "footer", "productDetail", "mediaQ-productDetail"],
      product: producto,
      esquema: producto.esquema,
      informacion: Object.getOwnPropertyNames(producto.information),
      details: Object.getOwnPropertyNames(producto.details),
      // styles: [""]
    });
  },


  finder: (req, res) => {
    let productList = index()
    try {
      if (req.query?.categoria) {
        productList = filter("categoria", req.query.categoria)
      }

      if (req.query && req.query.subcategoria) {
        productList = filter("subCategoria", req.query.subcategoria)
      }

      if (req.query && req.query.search) {
        productList = filter("search", req.query.search.toLowerCase())
        // productList = filter(product => product.name.toLowerCase().indexOf(req.query.name.toLowerCase()) > -1)
      }
      // console.log(productList.length);
      if (productList.length < 1) {
        productList = index()
      }

      return res.render("./products/productFinder", {
        title: "Detalle de producto",
        styles: ["style", "header", "footer", "productSearch", "mediaQ-productSearch"],
        products: productList,
      });
    } catch (error) {
      console.log(error)
      res.redirect("./products/productFinder")
    }
  },


  productCart: (req, res) => {
    return res.render("./products/productCart", {
      title: "Carrito de compras",
      styles: ["style", "header", "footer", "productCart", "mediaQ-productCart"]
    })
  },


  productCreateDetail: (req, res) => {
    return res.render("./products/productCreateDetail", {
      title: "Product Create Details",
      styles: ["style", "header", "footer", "productDetail", "mediaQ-newproduct", "productofinal"]
    })
  },


  // productSave: (req, res) => {
  //   let id = req.params.id;
  //   return res.render(`./products/${id}`, {
  //     title: "Product Save",
  //     styles: ["style", "header", "footer", "productDetail", "mediaQ-newproduct", "productofinal"]
  //   })
  // },


  // save: (req, res) => {
  //   req.body.imagenProducto = req.files[0]?.filename
  //   let newProduct = create(req.body)
  //   let products = index();
  //   products.push(newProduct)
  //   write(products)
  //   return res.redirect("/product/finder")
  // },


  productEdit: (req, res) => {
    let product = find(parseInt(req.params.id))
    if (!product) {
      return res.redirect("/product/finder")
    }
    return res.render('./products/productEdit', {
      title: `Edit ${product.name}`,
      styles: ["style", "header", "footer", "productDetail", "mediaQ-newproduct", "productofinal"],
      product: product
    })
  },


  edit: (req, res) => {
    let productToEdit = find(parseInt(req.params.id))
    let products = index();

    req.body.imagenProducto = productToEdit.imagen

    if (req.files[0] != undefined) {
      deleteImage(productToEdit.imagen)
      req.body.imagenProducto = req.files[0].filename
    }

    let edited = edit(req.body, productToEdit)

    let productModified = products.map(product => {
      if (product.id == edited.id) {
        product = edited
      }
      return product
    });
    
    write(productModified)
    return res.redirect(`/products/${req.params.id}`)
  },


  productDelete: (req, res) => {
    let product = find(parseInt(req.params.id))
    if (!product) {
      return res.redirect("/product/finder")
    }
    return res.render('./products/productDelete', {
      title: `delete ${product.name}`,
      styles: ["style", "header", "footer", "productDelete"],
      product: product
    })
  },

  destroy: (req, res) => {
    let product = find(parseInt(req.params.id))
    if (!product) {
      return res.redirect("/product/finder")
    }
    let products = index()
    let listWithoutDeletedProduct = products.filter(p => p.id !== product.id)
    deleteImage(product.imagen)
    write(listWithoutDeletedProduct)
    return res.redirect("/products/finder");
  },

  process: function (req, res) {
    let validaciones = validationResult(req)
    let { errors } = validaciones;
    
    if (errors && errors.length > 0) {
    deleteImage(req.files[0].filename) 
      return res.render('products/productCreateDetail', {
        title: "Publicar un nuevo producto",
        styles: ["style", "header", "footer", "productDetail", "mediaQ-newproduct", "productofinal"],
        oldData: req.body,
        errors: validaciones.mapped()
      });
    }
    else {
      req.body.imagenProducto = req.files[0]?.filename
      let newProduct = create(req.body)
      let products = index();
      products.push(newProduct)
      write(products)
      return res.redirect("/products/finder")
    }
  }
}
