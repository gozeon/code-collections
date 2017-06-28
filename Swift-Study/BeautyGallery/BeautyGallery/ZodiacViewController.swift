//
//  ZodiacViewController.swift
//  BeautyGallery
//
//  Created by goze on 17/2/23.
//  Copyright © 2017年 goze. All rights reserved.
//

import UIKit

class ZodiacViewController: UIViewController {
  
  var imageName: String?
  
  @IBOutlet weak var image: UIImageView!
  
  override func viewDidLoad() {
    super.viewDidLoad()
    // Do any additional setup after loading the view, typically from a nib.
    image.image = UIImage(named: imageName!)
    }
  
  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
  }
  
}
