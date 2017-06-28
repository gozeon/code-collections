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

public class DeleteOrder extends JFrame {

	private JPanel contentPane;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					DeleteOrder frame = new DeleteOrder();
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
	public DeleteOrder() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(DeleteOrder.class.getResource("/Image/00.PNG")));
		setTitle("\u5220\u9664\u8BA2\u5355");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u8BA2\u5355\u53F7\uFF1A");
		label.setBounds(126, 91, 54, 15);
		contentPane.add(label);
		
		JButton btnNewButton = new JButton("\u5220\u9664");
		btnNewButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
			}
		});
		btnNewButton.setBounds(98, 195, 93, 23);
		contentPane.add(btnNewButton);
		
		JButton btnNewButton_1 = new JButton("\u8FD4\u56DE");
		btnNewButton_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//返回按钮
				dispose();  //关闭
			}
		});
		btnNewButton_1.setBounds(225, 195, 93, 23);
		contentPane.add(btnNewButton_1);
		
		final JComboBox cob_or_id = new JComboBox();
		cob_or_id.setBounds(190, 88, 65, 21);
		Dao dao = new Dao();
		for(int i=0;i<dao.getList("or_id", "tb_order").size();i++)
		{
			cob_or_id.addItem(dao.getList("or_id", "tb_order").get(i));
		}
		contentPane.add(cob_or_id);
		
		btnNewButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//删除按钮
				String id = (String) cob_or_id.getSelectedItem();
				
				admin admin = new admin();
				CreateSql sql = new CreateSql();
				
				admin.deleteOrder(sql.deleteOrder(id));
								
				JOptionPane.showMessageDialog(null, "删除成功", "正确信息", JOptionPane.INFORMATION_MESSAGE);
			}
		});
	}

}
