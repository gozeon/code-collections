package com.example.demo.controller;

import com.example.demo.exception.ProductNotFoundException;
import com.example.demo.model.Product;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
public class ProductServiceController {
    private static Map<String, Product> productMap = new HashMap<>();

    static {
        Product honey = new Product();
        honey.setId("1");
        honey.setName("Honey");
        productMap.put(honey.getId(), honey);

        Product almond = new Product();
        almond.setId("2");
        almond.setName("Almond");
        productMap.put(almond.getId(), almond);
    }

    @RequestMapping("/products")
    public ResponseEntity<Object> getProduct() {
        return new ResponseEntity<>(productMap.values(), HttpStatus.OK);
    }

    @RequestMapping(value = "/products", method = RequestMethod.POST)
    public ResponseEntity<Object> createProduct(
            @RequestBody Product product
    ) {
        productMap.put(product.getId(), product);
        return new ResponseEntity<>("Product is created successfully", HttpStatus.CREATED);
    }

    @RequestMapping(value = "/products/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Object> updateProduct(
            @PathVariable("id") String id,
            @RequestBody Product product
    ) {
        if (!productMap.containsKey(id)) {
            throw new ProductNotFoundException();
        }
        productMap.remove(id);
        product.setId(id);
        productMap.put(id, product);
        return new ResponseEntity<>("Product is updated successfully", HttpStatus.OK);
    }

    @RequestMapping(value = "/products/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> delete(@PathVariable("id") String id) {
        productMap.remove(id);
        return new ResponseEntity<>("Product is deleted successsfully", HttpStatus.OK);
    }

}
