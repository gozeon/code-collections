struct course_grade {
    char course_name[32];
    char letter_grade;
};

struct student {
    char name[32];
    short class_year;
    int num_course_completed;
    struct course_grade course_completed[48];
};

typedef struct student student_t;
typedef struct course_grade grade_t;

double computed_gpa(grade_t course_list[], int num_course) {
    double sum = 0.0;

    for (int i = 0; i < num_course; i++) {
        if (course_list[i].letter_grade == 'A') {
            sum += 4.0;
        } else if (course_list[i].letter_grade == 'B') {
            sum += 3.0;
        } else if (course_list[i].letter_grade == 'C') {
            sum += 2.0;
        } else if (course_list[i].letter_grade == 'D') {
            sum += 1.0;
        }
    }

    return sum / num_course;
}

void print_student(student_t s, double gpa) {
    printf("%s, Class of %d, GPA: %2.2f\n", s.name, s.class_year, gpa);
}

void do_main_01() {
    student_t students[2] = {
        {
            "A. Student",
            2022,
            3,
            {
                {
                    "AAAA",
                    'A'
                },
                {
                    "BBBB",
                    'B'
                },
                {
                    "CCCC",
                    'C'
                },
            }
        },
        {
            "B. Student",
            2023,
            4,
            {
                {
                    "AAAA",
                    'A'
                },
                {
                    "BBBB",
                    'B'
                },
                {
                    "CCCC",
                    'C'
                },
                {
                    "DDDD",
                    'D'
                },
            }
        },
    };

    int num_student = sizeof(students) / sizeof(student_t);

    for (int i = 0; i < num_student; i++) {
        double gpa = computed_gpa(students[i].course_completed, students[i].num_course_completed);
        print_student(students[i], gpa);
    }
}
