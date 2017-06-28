//
//  ViewController.swift
//  loveFinder
//
//  Created by goze on 17/2/22.
//  Copyright © 2017年 goze. All rights reserved.
//

import UIKit

class ViewController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var name: UITextField!
    
    @IBOutlet weak var xingbie: UISegmentedControl!
    
    @IBOutlet weak var birth: UIDatePicker!
    
    @IBOutlet weak var hashome: UISwitch!
    
    @IBOutlet weak var height: UILabel!
    
    @IBOutlet weak var result: UITextView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        name.delegate = self
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


    @IBAction func heightChanged(_ sender: Any) {
        // round the step to int
        let slider = sender as! UISlider
        let i = Int(slider.value)
        height.text = "\(i)厘米"
    }
    
    @IBAction func submit(_ sender: Any) {
        let nameText = (name.text?.characters.count)! > 0 ? name.text! : "无名氏"
        let sexText = xingbie.selectedSegmentIndex == 0 ? "高富帅" : "白净美"
        let hasHome = hashome.isOn ? "有房" : "没房"
        
        let now = NSDate()
        let componentsNow = Calendar.current.dateComponents([.year, .month, .day], from: now as Date)
        let componentsBirth = Calendar.current.dateComponents([.year, .month, .day], from: birth.date)
        let age = componentsNow.year! - componentsBirth.year! + 1
        
        result.text = "我叫\(nameText)，我是\(sexText)，\(age)岁，身高\(height.text!)， \(hasHome), 求恋爱"
    }
    
    // UITextFieldDelegate
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        return true
    }
}

