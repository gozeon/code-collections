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

public class AddClient extends JFrame {

	private JPanel contentPane;
	private JTextField txt_name;
	private JTextField txt_paw;
	private JTextField txt_adr;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					AddClient frame = new AddClient();
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
	public AddClient() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(AddClient.class.getResource("/Image/00.PNG")));
		setTitle("\u6DFB\u52A0\u5BA2\u6237");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u5BA2\u6237\u540D\uFF1A");
		label.setBounds(105, 56, 54, 15);
		contentPane.add(label);
		
		JLabel label_1 = new JLabel("\u5BC6\u7801\uFF1A");
		label_1.setBounds(105, 102, 54, 15);
		contentPane.add(label_1);
		
		JLabel label_2 = new JLabel("\u8054\u7CFB\u65B9\u5F0F\uFF1A");
		label_2.setBounds(105, 149, 75, 15);
		contentPane.add(label_2);
		
		txt_name = new JTextField();
		txt_name.setBounds(190, 53, 145, 21);
		contentPane.add(txt_name);
		txt_name.setColumns(10);
		
		txt_paw = new JTextField();
		txt_paw.setBounds(190, 99, 145, 21);
		contentPane.add(txt_paw);
		txt_paw.setColumns(10);
		
		txt_adr = new JTextField();
		txt_adr.setBounds(190, 146, 145, 21);
		contentPane.add(txt_adr);
		txt_adr.setColumns(10);
		
		JButton button = new JButton("\u6DFB\u52A0");
		button.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//添加按钮
				String name = txt_name.getText();
				String paw = txt_paw.getText();
				String adr = txt_adr.getText();
				
				if( name.equals("")){
					JOptionPane.showMessageDialog(null, "请输入用户名", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else if(paw.equals("")){
					JOptionPane.showMessageDialog(null, "请输入密码", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else if(adr.equals("")){
					JOptionPane.showMessageDialog(null, "请输入联系方式", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else{
					admin admin = new admin();
					CreateSql sql = new CreateSql();
					admin.addClient(sql.addClient(name, paw, adr)); //有问题
					JOptionPane.showMessageDialog(null, "创建成功！", "正确", JOptionPane.INFORMATION_MESSAGE);
				}
			}
		});
		button.setBounds(105, 209, 93, 23);
		contentPane.add(button);
		
		JButton button_1 = new JButton("\u53D6\u6D88");
		button_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//返回按钮
				dispose();   //关闭界面
			}
		});
		button_1.setBounds(242, 209, 93, 23);
		contentPane.add(button_1);
	}
}
