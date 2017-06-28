package GUI;

import java.awt.BorderLayout;
import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.JButton;

import Action.CreateSql;
import Action.admin;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.Toolkit;

public class AddRoom extends JFrame {

	private JPanel contentPane;
	private JTextField txt_price;
	private JTextField txt_id;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					AddRoom frame = new AddRoom();
					frame.setVisible(true);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		});
	}

	/**
	 * Create the frame.
	 */
	public AddRoom() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(AddRoom.class.getResource("/Image/00.PNG")));
		setTitle("\u6DFB\u52A0\u623F\u95F4");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 349);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u623F\u95F4\u53F7\uFF1A");
		label.setBounds(110, 47, 54, 15);
		contentPane.add(label);
		
		JLabel label_1 = new JLabel("\u623F\u95F4\u7C7B\u578B\uFF1A");
		label_1.setBounds(110, 98, 75, 15);
		contentPane.add(label_1);
		
		JLabel label_2 = new JLabel("\u623F\u95F4\u4EF7\u683C\uFF1A");
		label_2.setBounds(110, 154, 75, 15);
		contentPane.add(label_2);
		
		JLabel label_3 = new JLabel("\u623F\u95F4\u72B6\u6001\uFF1A");
		label_3.setBounds(110, 204, 65, 15);
		contentPane.add(label_3);
		
		txt_price = new JTextField();
		txt_price.setBounds(193, 151, 93, 21);
		contentPane.add(txt_price);
		txt_price.setColumns(10);
		
		JLabel label_4 = new JLabel("/\u5929");
		label_4.setBounds(296, 154, 54, 15);
		contentPane.add(label_4);
		
		txt_id = new JTextField();
		txt_id.setBounds(193, 44, 93, 21);
		contentPane.add(txt_id);
		txt_id.setColumns(10);
		
		final JComboBox cbox_style = new JComboBox();
		cbox_style.setToolTipText("");
		cbox_style.setBounds(193, 95, 93, 21);
		cbox_style.addItem("商务大床房");
		cbox_style.addItem("豪华套房");
		cbox_style.addItem("标准双人间");
		cbox_style.addItem("标准大床房");
		contentPane.add(cbox_style);
		
		final JComboBox cbox_state = new JComboBox();
		cbox_state.setBounds(193, 201, 93, 21);
		cbox_state.addItem("空房");
		cbox_state.addItem("已住");
		cbox_state.addItem("维修");
		contentPane.add(cbox_state);
		
		JButton btnNewButton = new JButton("\u6DFB\u52A0");
		btnNewButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//添加按钮
				String id = txt_id.getText();
				String style = (String) cbox_style.getSelectedItem();
				String price = txt_price.getText();
				String state = (String) cbox_state.getSelectedItem();
				
				if(id.equals("")){
					JOptionPane.showMessageDialog(null, "请输入房间号", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else if(price.equals("")){
					JOptionPane.showMessageDialog(null, "请输入价格", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else{
					admin admin = new admin();
					CreateSql sql = new CreateSql();
					
					admin.addRoom(sql.addRoom(id, style, price, state)); //有问题
					JOptionPane.showMessageDialog(null, "添加成功！", "正确", JOptionPane.INFORMATION_MESSAGE);
				}
			}
		});
		btnNewButton.setBounds(92, 267, 93, 23);
		contentPane.add(btnNewButton);
		
		JButton btnNewButton_1 = new JButton("\u53D6\u6D88");
		btnNewButton_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//取消按钮
				dispose(); //关闭
			}
		});
		btnNewButton_1.setBounds(226, 267, 93, 23);
		contentPane.add(btnNewButton_1);
	}
}
