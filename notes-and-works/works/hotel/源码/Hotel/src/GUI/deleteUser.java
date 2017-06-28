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
import DAO.Dao;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.Toolkit;

public class deleteUser extends JFrame {

	private JPanel contentPane;
	private JTextField txt_user;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					deleteUser frame = new deleteUser();
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
	public deleteUser() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(deleteUser.class.getResource("/Image/00.PNG")));
		setTitle("\u5220\u9664\u7BA1\u7406\u5458");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u7528\u6237\u540D\uFF1A");
		label.setBounds(106, 94, 54, 15);
		contentPane.add(label);
		
		txt_user = new JTextField();
		txt_user.setBounds(170, 91, 158, 21);
		contentPane.add(txt_user);
		txt_user.setColumns(10);
		
		JButton btn_true = new JButton("\u5220\u9664");
		btn_true.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//删除按钮
				String user = txt_user.getText();
				if(user.equals("")){
					JOptionPane.showMessageDialog(null, "请输入用户名", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else {
					Dao dao = new Dao();
					admin admin = new admin();
					CreateSql sql = new CreateSql();
					admin.deleteUser(sql.deleteSql(user));  //有问题
					JOptionPane.showMessageDialog(null, "删除成功！", "正确", JOptionPane.INFORMATION_MESSAGE);
				}
			}
		});
		btn_true.setBounds(78, 174, 93, 23);
		contentPane.add(btn_true);
		
		JButton btn_cancle = new JButton("\u53D6\u6D88");
		btn_cancle.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//取消按钮
				dispose();   //关闭界面
			}
		});
		btn_cancle.setBounds(261, 174, 93, 23);
		contentPane.add(btn_cancle);
	}

}
