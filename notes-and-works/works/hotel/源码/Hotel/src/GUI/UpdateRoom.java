package GUI;

import java.awt.BorderLayout;
import java.awt.EventQueue;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.border.EmptyBorder;
import javax.swing.JLabel;
import javax.swing.JButton;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.JComboBox;

import Action.CreateSql;
import Action.admin;
import DAO.Dao;

import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.Toolkit;

public class UpdateRoom extends JFrame {

	private JPanel s;
	private JTextField txt_price;

	/**
	 * Launch the application.
	 */
	public static void main(String[] args) {
		EventQueue.invokeLater(new Runnable() {
			public void run() {
				try {
					UpdateRoom frame = new UpdateRoom();
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
	public UpdateRoom() {
		setIconImage(Toolkit.getDefaultToolkit().getImage(UpdateRoom.class.getResource("/Image/00.PNG")));
		setTitle("\u4FEE\u6539\u623F\u95F4\u4FE1\u606F");
		setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		setBounds(100, 100, 450, 351);
		s = new JPanel();
		s.setBorder(new EmptyBorder(5, 5, 5, 5));
		setContentPane(s);
		s.setLayout(null);
		
		JLabel lblNewLabel = new JLabel("\u623F\u95F4\u53F7\uFF1A");
		lblNewLabel.setBounds(115, 41, 54, 15);
		s.add(lblNewLabel);
		
		JLabel lblNewLabel_1 = new JLabel("\u623F\u95F4\u7C7B\u578B\uFF1A");
		lblNewLabel_1.setBounds(115, 92, 66, 15);
		s.add(lblNewLabel_1);
		
		JLabel lblNewLabel_2 = new JLabel("\u623F\u95F4\u4EF7\u683C\uFF1A");
		lblNewLabel_2.setBounds(115, 143, 66, 15);
		s.add(lblNewLabel_2);
		
		JLabel lblNewLabel_3 = new JLabel("\u623F\u95F4\u72B6\u6001\uFF1A");
		lblNewLabel_3.setBounds(115, 199, 66, 15);
		s.add(lblNewLabel_3);
		
		JButton btnNewButton = new JButton("\u786E\u5B9A");
		
		btnNewButton.setBounds(88, 255, 93, 23);
		s.add(btnNewButton);
		
		JButton btnNewButton_1 = new JButton("\u53D6\u6D88");
		btnNewButton_1.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//取消按钮
				dispose();
			}
		});
		btnNewButton_1.setBounds(251, 255, 93, 23);
		s.add(btnNewButton_1);
		
		txt_price = new JTextField();
		txt_price.setBounds(191, 140, 105, 21);
		s.add(txt_price);
		txt_price.setColumns(10);
		
		JLabel label = new JLabel("/\u5929");
		label.setBounds(306, 143, 54, 15);
		s.add(label);
		
		final JComboBox cob_style = new JComboBox();
		cob_style.setBounds(191, 89, 105, 21);
		cob_style.addItem("商务大床房");
		cob_style.addItem("豪华套房");
		cob_style.addItem("标准双人间");
		cob_style.addItem("标准大床房");
		s.add(cob_style);
		
		final JComboBox cob_state = new JComboBox();
		cob_state.setBounds(191, 196, 105, 21);
		cob_state.addItem("空房");
		cob_state.addItem("已住");
		cob_state.addItem("维修");
		s.add(cob_state);
		
		final JComboBox cob_id = new JComboBox();
		Dao ddDao=new Dao();  //创建数据库对象
		//调用 getList()方法  getCombox()方法
//		cob_id=ddDao.getCombox(ddDao.getList("ro_id", "tb_room"));
		cob_id.setBounds(191, 38, 105, 21);
		
//		将房间号形成下拉列表 与getCombox()方法相同
  		for(int i=0;i<ddDao.getList("ro_id", "tb_room").size();i++)
		{
			//System.out.print(ddDao.getList("ro_id", "tb_room").get(i));
			cob_id.addItem(ddDao.getList("ro_id", "tb_room").get(i));
		}
		
		s.add(cob_id);
		
		btnNewButton.addActionListener(new ActionListener() {
			public void actionPerformed(ActionEvent e) {
				//确定按钮
				String id = (String) cob_id.getSelectedItem();
				String style = (String) cob_style.getSelectedItem() ;
				String price = txt_price.getText(); 
				String state = (String) cob_state.getSelectedItem(); 
				
				if(price.equals("")){
					JOptionPane.showMessageDialog(null, "请输入金额", "错误信息", JOptionPane.ERROR_MESSAGE);
				}else{
					admin admin = new admin();
					CreateSql sql = new CreateSql();
					
					admin.updateRoom(sql.updateRoom(id, style, price, state));
					JOptionPane.showMessageDialog(null, "修改成功", "正确信息", JOptionPane.INFORMATION_MESSAGE);
					dispose();
				}
			}
		});
	}

}
