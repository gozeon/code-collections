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

public class DeleteClient extends JFrame {

	private JPanel contentPane;
	private JTextField txt_name;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					DeleteClient frame = new DeleteClient();
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
	public DeleteClient() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(DeleteClient.class.getResource("/Image/00.PNG")));
		setTitle("\u5220\u9664\u5BA2\u6237");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u5BA2\u6237\u540D\uFF1A");
		label.setBounds(109, 101, 54, 15);
		contentPane.add(label);
		
		txt_name = new JTextField();
		txt_name.setBounds(173, 98, 173, 21);
		contentPane.add(txt_name);
		txt_name.setColumns(10);
		
		JButton btnNewButton = new JButton("\u5220\u9664");
		btnNewButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//删除按钮
				String name = txt_name.getText();
				if(name.equals("")){
					JOptionPane.showMessageDialog(null, "请输入用户名", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else{
					admin admin = new admin();
					CreateSql sql = new CreateSql();
					
					admin.deleteClient(sql.deleteClient(name));
					JOptionPane.showMessageDialog(null, "删除成功！", "正确", JOptionPane.INFORMATION_MESSAGE);
				}
			}
		});
		btnNewButton.setBounds(96, 190, 93, 23);
		contentPane.add(btnNewButton);
		
		JButton btnNewButton_1 = new JButton("\u53D6\u6D88");
		btnNewButton_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//取消按钮
				dispose();  //关闭
			}
		});
		btnNewButton_1.setBounds(266, 190, 93, 23);
		contentPane.add(btnNewButton_1);
	}

}
