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

public class updatePassword extends JFrame {

	private JPanel contentPane;
	private JTextField txt_paw;
	private JTextField txt_name;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					updatePassword frame = new updatePassword();
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
	public updatePassword() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(updatePassword.class.getResource("/Image/00.PNG")));
		setTitle("\u4FEE\u6539\u5BC6\u7801");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 288);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u65B0\u5BC6\u7801\uFF1A");
		label.setBounds(102, 99, 54, 15);
		contentPane.add(label);
		
		txt_paw = new JTextField();
		txt_paw.setBounds(166, 96, 167, 21);
		contentPane.add(txt_paw);
		txt_paw.setColumns(10);
		
		JButton btn_true = new JButton("\u4FEE\u6539");
		btn_true.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//修改按钮
				String nam = txt_name.getText();
				String paw = txt_paw.getText();
				
				if (nam.equals("")) {
					JOptionPane.showMessageDialog(null, "请输入用户名", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else if(paw.equals("")){
					JOptionPane.showMessageDialog(null, "请输入密码", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else {
					admin admin = new admin();
					CreateSql sql = new CreateSql();
					
					admin.updatePassword(sql.updatePassword(nam, paw));
					JOptionPane.showMessageDialog(null, "修改成功", "正确信息", JOptionPane.INFORMATION_MESSAGE);
				}
			}
		});
		btn_true.setBounds(82, 172, 93, 23);
		contentPane.add(btn_true);
		
		JButton btn_cancle = new JButton("\u53D6\u6D88");
		btn_cancle.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//取消按钮
				dispose();   //关闭界面
			}
		});
		btn_cancle.setBounds(255, 172, 93, 23);
		contentPane.add(btn_cancle);
		
		JLabel label_1 = new JLabel("\u60A8\u7684\u7528\u6237\u540D\uFF1A");
		label_1.setBounds(70, 39, 86, 15);
		contentPane.add(label_1);
		
		txt_name = new JTextField();
		txt_name.setBounds(166, 36, 167, 21);
		contentPane.add(txt_name);
		txt_name.setColumns(10);
	}

}
