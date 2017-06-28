//
//  ViewController.swift
//  ChineseZodiac
//
//  Created by goze on 17/2/22.
//  Copyright © 2017年 goze. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var yearOfbirtg: UITextField!
    @IBOutlet weak var image: UIImageView!
    let offset = 4
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        yearOfbirtg.resignFirstResponder()
    }
    
    @IBAction func okTapped(_ sender: Any) {
        yearOfbirtg.resignFirstResponder()
        
        if let year = Int(yearOfbirtg.text!) {
            let imageNumber = (year - offset) % 12
            image.image = UIImage(named: String(imageNumber))
        }    }
}

