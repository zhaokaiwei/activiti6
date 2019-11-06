/**
 * @author zkw
 * @date 2019/10/21 18:29
 */
public class Objective4 {

    private static int max_income;
    private static int[] max_income_list;
    private static int[][] table = new int[][]{
            {3,2,4,1},
            {15,1,17,7},
            {9,4,6,5},
            {11,1,4,3}
    };

    public static void main(String[] args) {
        plant(3,0,0,new int[6],1);
        plant(3,1,0,new int[6],1);
        plant(3,2,0,new int[6],1);
        plant(3,3,0,new int[6],1);

        for (int i=1;i<max_income_list.length;++i){
            switch (max_income_list[i]){
                case 0:
                    System.out.println("第"+i+"年：水稻");
                    break;
                case 1:
                    System.out.println("第"+i+"年：大豆");
                    break;
                case 2:
                    System.out.println("第"+i+"年：燕麦");
                    break;
                case 3:
                    System.out.println("第"+i+"年：牧草");
                    break;
            }
        }

        System.out.println("最大收入为："+max_income);
    }

    /** 种植方法
     * @param pre_crop 去年种植的作物，0：水稻，1：大豆，2：燕麦，3：牧草
     * @param curr_crop 今年种植的作物，0：水稻，1：大豆，2：燕麦，3：牧草
     * @param curr_income 当前收入
     * @param crop_list     历年作物种植列表
     * @param year          种植当年作物是第几年
     */
    public static void plant(int pre_crop,int curr_crop,int curr_income,int[] crop_list,int year){
        crop_list[year] = curr_crop;
        curr_income += table[pre_crop][curr_crop];

        if (year == 5){
            if (max_income < curr_income){
                max_income = curr_income;
                max_income_list = crop_list.clone();
            }

            return ;
        }

        plant(curr_crop,0,curr_income,crop_list,year+1);
        plant(curr_crop,1,curr_income,crop_list,year+1);
        plant(curr_crop,2,curr_income,crop_list,year+1);
        plant(curr_crop,3,curr_income,crop_list,year+1);
    }
}
