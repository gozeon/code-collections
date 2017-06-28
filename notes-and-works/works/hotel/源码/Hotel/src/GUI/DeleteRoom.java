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

public class DeleteRoom extends JFrame {

	private JPanel contentPane;
	private JTextField txt_id;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					DeleteRoom frame = new DeleteRoom();
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
	public DeleteRoom() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(DeleteRoom.class.getResource("/Image/00.PNG")));
		setTitle("\u5220\u9664\u623F\u95F4");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 300);
		contentPane = new JPanel();
		contentPane.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(contentPane);
		contentPane.setLayout(null);
		
		JLabel label = new JLabel("\u623F\u95F4\u53F7\uFF1A");
		label.setBounds(119, 101, 54, 15);
		contentPane.add(label);
		
		txt_id = new JTextField();
		txt_id.setBounds(183, 98, 66, 21);
		contentPane.add(txt_id);
		txt_id.setColumns(10);
		
		JButton btnNewButton = new JButton("\u5220\u9664");
		btnNewButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//删除按钮
				String id = txt_id.getText();
				
				if(id.equals("")){
					JOptionPane.showMessageDialog(null, "请输入房间号", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else{
					admin admin = new admin();
					CreateSql sql = new CreateSql();
					admin.deleteRoom(sql.deleteRoom(id));
					JOptionPane.showMessageDialog(null, "删除成功！", "正确", JOptionPane.INFORMATION_MESSAGE);
				}
			}
		});
		btnNewButton.setBounds(80, 185, 93, 23);
		contentPane.add(btnNewButton);
		
		JButton btnNewButton_1 = new JButton("\u53D6\u6D88");
		btnNewButton_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//取消按钮
				dispose(); //关闭
			}
		});
		btnNewButton_1.setBounds(211, 185, 93, 23);
		contentPane.add(btnNewButton_1);
	}

}
