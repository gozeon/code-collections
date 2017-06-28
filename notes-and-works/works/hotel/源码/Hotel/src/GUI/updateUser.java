package GUI;

import java.awt.BorderLayout;
import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JButton;

import Action.CreateSql;
import Action.admin;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.Toolkit;

public class updateUser extends JFrame {

	private JPanel contentPane;
	private JTextField txt_new_name;
	private JTextField txt_old_name;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					updateUser frame = new updateUser();
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
	public updateUser() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(updateUser.class.getResource("/Image/00.PNG")));
		setTitle("\u4FEE\u6539\u7528\u6237\u540D");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 285);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u65B0\u7528\u6237\u540D\uFF1A");
		label.setBounds(96, 95, 72, 15);
		contentPane.add(label);
		
		txt_new_name = new JTextField();
		txt_new_name.setBounds(190, 92, 131, 21);
		contentPane.add(txt_new_name);
		txt_new_name.setColumns(10);
		
		JButton btn_true = new JButton("\u4FEE\u6539");
		btn_true.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//修改按钮
				String onam = txt_old_name.getText();
				String nnam = txt_new_name.getText();
				
				if (onam.equals("")) {
					JOptionPane.showMessageDialog(null, "请输入老用户名！", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else if(nnam.equals("")){
					JOptionPane.showMessageDialog(null, "请输入新用户名", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else if(onam.equals(nnam)){
					JOptionPane.showMessageDialog(null, "用户名相同！重新输入！", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else{
					admin admin = new admin();
					CreateSql sql = new CreateSql();
					
					admin.updateUser(sql.updateUser(onam, nnam));
					JOptionPane.showMessageDialog(null, "修改成功！重新登录！", "正确信息", JOptionPane.INFORMATION_MESSAGE);
					dispose();
				}
			}
		});
		btn_true.setBounds(94, 171, 93, 23);
		contentPane.add(btn_true);
		
		JButton btn_cancle = new JButton("\u53D6\u6D88");
		btn_cancle.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//取消按钮
				dispose();   //关闭界面
				String user="";
				main main = new main(user);
				main.setLocationRelativeTo(null);
				main.setVisible(true);
			}
		});
		btn_cancle.setBounds(240, 171, 93, 23);
		contentPane.add(btn_cancle);
		
		JLabel label_1 = new JLabel("\u8001\u7528\u6237\u540D\uFF1A");
		label_1.setBounds(96, 39, 72, 15);
		contentPane.add(label_1);
		
		txt_old_name = new JTextField();
		txt_old_name.setBounds(190, 36, 131, 21);
		contentPane.add(txt_old_name);
		txt_old_name.setColumns(10);
	}
}
