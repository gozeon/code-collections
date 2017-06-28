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

public class addUser extends JFrame {

	private JPanel contentPane;
	private JTextField txt_user;
	private JTextField txt_paw;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					addUser frame = new addUser();
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
	public addUser() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(addUser.class.getResource("/Image/00.PNG")));
		setTitle("\u6DFB\u52A0\u7BA1\u7406\u5458");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u7528\u6237\u540D\uFF1A");
		label.setBounds(112, 67, 54, 15);
		contentPane.add(label);
		
		txt_user = new JTextField();
		txt_user.setBounds(176, 64, 163, 21);
		contentPane.add(txt_user);
		txt_user.setColumns(10);
		
		JLabel label_1 = new JLabel("\u5BC6\u7801\uFF1A");
		label_1.setBounds(112, 123, 54, 15);
		contentPane.add(label_1);
		
		txt_paw = new JTextField();
		txt_paw.setBounds(176, 120, 163, 21);
		contentPane.add(txt_paw);
		txt_paw.setColumns(10);
		
		JButton btn_true = new JButton("\u589E\u52A0");
		btn_true.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//增加按钮
				String user = txt_user.getText();
				String paw = txt_paw.getText();
				if (user.equals("")) {
					JOptionPane.showMessageDialog(null, "请输入用户名", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else if (paw.equals("")){
					JOptionPane.showMessageDialog(null, "请输入密码", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else{
					admin admin = new admin();
					CreateSql sql = new CreateSql();
					admin.addUser(sql.addSql(user, paw));   //有问题
					JOptionPane.showMessageDialog(null, "创建成功！", "正确", JOptionPane.INFORMATION_MESSAGE);
				}
			}
		});
		btn_true.setBounds(92, 191, 93, 23);
		contentPane.add(btn_true);
		
		JButton btn_cancle = new JButton("\u53D6\u6D88");
		btn_cancle.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//取消按钮
				dispose();   //关闭界面
			}
		});
		btn_cancle.setBounds(257, 191, 93, 23);
		contentPane.add(btn_cancle);
	}
}
