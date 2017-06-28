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
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import javax.swing.JComboBox;

import Action.CreateSql;
import Action.admin;
import DAO.Dao;
import java.awt.Toolkit;

public class UpdateClient extends JFrame {

	private JPanel contentPane;
	private JTextField txt_adr;
	private JTextField txt_paw;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					UpdateClient frame = new UpdateClient();
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
	public UpdateClient() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(UpdateClient.class.getResource("/Image/00.PNG")));
		setTitle("\u4FEE\u6539\u5BA2\u6237\u4FE1\u606F");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel lblNewLabel = new JLabel("\u5BA2\u6237\u540D\uFF1A");
		lblNewLabel.setBounds(111, 34, 54, 15);
		contentPane.add(lblNewLabel);
		
		JLabel label = new JLabel("\u5BC6\u7801\uFF1A");
		label.setBounds(111, 77, 54, 15);
		contentPane.add(label);
		
		JLabel label_1 = new JLabel("\u8054\u7CFB\u65B9\u5F0F\uFF1A");
		label_1.setBounds(111, 124, 67, 15);
		contentPane.add(label_1);
		
		txt_adr = new JTextField();
		txt_adr.setBounds(175, 124, 154, 21);
		contentPane.add(txt_adr);
		txt_adr.setColumns(10);
		
		txt_paw = new JTextField();
		txt_paw.setBounds(175, 77, 154, 21);
		contentPane.add(txt_paw);
		txt_paw.setColumns(10);
		
		JButton button = new JButton("\u4FEE\u6539");

		button.setBounds(85, 217, 93, 23);
		contentPane.add(button);
		
		JButton button_1 = new JButton("\u53D6\u6D88");
		button_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//取消按钮
				dispose();  //关闭
			}
		});
		button_1.setBounds(255, 217, 93, 23);
		contentPane.add(button_1);
		
		JLabel label_2 = new JLabel("\u8BA2\u5355\u53F7\uFF1A");
		label_2.setBounds(111, 175, 54, 15);
		contentPane.add(label_2);
		
		final JComboBox cob_name = new JComboBox();
		cob_name.setBounds(175, 31, 154, 21);
		Dao dao = new Dao();
		for(int i=0;i<dao.getList("cl_name", "tb_client").size();i++)
		{
			cob_name.addItem(dao.getList("cl_name", "tb_client").get(i));
		}
		contentPane.add(cob_name);
		
		final JComboBox cob_or_id = new JComboBox();
		cob_or_id.setBounds(175, 172, 67, 21);
	
		for(int i=0;i<dao.getList("or_id", "tb_order").size();i++)
		{
			cob_or_id.addItem(dao.getList("or_id", "tb_order").get(i));
		}
		contentPane.add(cob_or_id);
		
		button.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//确定按钮
				String name = (String) cob_name.getSelectedItem();
				String paw = txt_paw.getText();
				String adr = txt_adr.getText();
				String or_id = (String) cob_or_id.getSelectedItem();
				
				if (paw.equals("")) {
					JOptionPane.showMessageDialog(null, "请输人密码", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else if(adr.equals("")){
					JOptionPane.showMessageDialog(null, "请输入联系方式", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else {
					admin admin = new admin();
					CreateSql sql = new CreateSql();
					
					admin.updateClient(sql.updateCient(name, paw, adr, or_id));
					JOptionPane.showMessageDialog(null, "修改成功", "正确信息", JOptionPane.INFORMATION_MESSAGE);
				}
			}
		});
	}
}
