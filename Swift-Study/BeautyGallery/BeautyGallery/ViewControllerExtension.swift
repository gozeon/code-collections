//
//  ViewControllerExtension.swift
//  BeautyGallery
//
//  Created by goze on 17/2/23.
//  Copyright © 2017年 goze. All rights reserved.
//

import UIKit

extension ViewController: UIPickerViewDataSource {
  // returns the number of 'columns' to display.
  @available(iOS 2.0, *)
  public func numberOfComponents(in pickerView: UIPickerView) -> Int{
    return 1
  }
  
  
  // returns the # of rows in each component..
  @available(iOS 2.0, *)
  public func pickerView(_ pickerView: UIPickerView, numberOfRowsInComponent component: Int) -> Int {
    return zodiacs.count
}
}

extension ViewController: UIPickerViewDelegate {
  // these methods return either a plain NSString, a NSAttributedString, or a view (e.g UILabel) to display the row for the component.
  // for the view versions, we cache any hidden and thus unused views and pass them back for reuse.
  // If you return back a different object, the old one will be released. the view will be centered in the row rect
  @available(iOS 2.0, *)
  public func pickerView(_ pickerView: UIPickerView, titleForRow row: Int, forComponent component: Int) -> String? {
    return zodiacs[row]
  }

}
