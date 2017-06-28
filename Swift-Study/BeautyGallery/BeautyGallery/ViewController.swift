//
//  ViewController.swift
//  BeautyGallery
//
//  Created by goze on 17/2/23.
//  Copyright © 2017年 goze. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

  @IBOutlet weak var zodiacsPicker: UIPickerView!
  
  let zodiacs = ["mouse", "cattle", "tiger", "rabbit", "dragon", "snake", "horse", "sheep", "monkey", "chicken", "dog", "pig"]
  
  override func viewDidLoad() {
    super.viewDidLoad()
    // Do any additional setup after loading the view, typically from a nib.
    
    zodiacsPicker.dataSource = self
    zodiacsPicker.delegate = self
  }

  override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
    // Dispose of any resources that can be recreated.
  }
  
  override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
    if segue.identifier == "GoToZodiac" {
      let index = zodiacsPicker.selectedRow(inComponent: 0)
      let imageName = zodiacs[index]
      
      let vc = segue.destination as! ZodiacViewController
      vc.imageName = imageName
    }
  }
  
  @IBAction func close(segue: UIStoryboardSegue) {
    
  }
}

