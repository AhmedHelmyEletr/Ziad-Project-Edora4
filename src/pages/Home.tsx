import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, BookOpen, Award, ArrowRight, Target, BarChart2, MessageSquare } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            مستقبل إدارة المدارس هنا
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            إيدورا منصة شاملة مصممة لتبسيط التعليم وربط المدرسين والطلاب والحفاظ على إطلاع الوالدين.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              ابدأ كمدير
            </Link>
            <Link
              to="/teacher-login"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-transform transform hover:scale-105"
            >
              دخول المدرس
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <h3 className="text-4xl font-bold text-blue-600">150+</h3>
              <p className="text-gray-600 mt-2">مدرسة تم تمكينها</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-bold text-blue-600">10,000+</h3>
              <p className="text-gray-600 mt-2">مدرس نشط</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-bold text-blue-600">50,000+</h3>
              <p className="text-gray-600 mt-2">طالب مشارك</p>
            </div>
            <div className="p-4">
              <h3 className="text-4xl font-bold text-blue-600">98%</h3>
              <p className="text-gray-600 mt-2">رضا الوالدين</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              مميزات قوية للتعليم الحديث
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              كل ما تحتاجه لإدارة مؤسستك التعليمية بكفاءة.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<Users className="h-8 w-8 text-blue-600" />} title="إدارة المدرسين" description="ملفات شاملة للمدرسين، إنشاء تلقائي للبريد الإلكتروني، وتتبع الأداء." />
            <FeatureCard icon={<BookOpen className="h-8 w-8 text-green-600" />} title="تتبع الطلاب" description="مراقبة الحضور، إدارة نتائج الامتحانات، والحفاظ على سجلات الطلاب التفصيلية بسهولة." />
            <FeatureCard icon={<Award className="h-8 w-8 text-purple-600" />} title="بوابة الوالدين" description="وصول آمن للوالدين لعرض تقدم أطفالهم الأكاديمي والحضور ونتائج الامتحانات." />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              خطوات بسيطة للبدء
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              عملية مبسطة لكل دور في مؤسستك.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <Step number="1" title="إعداد المدير" description="سجل مدرستك، أضف المدرسين، وقم بتكوين الفصول والمواد في دقائق." />
            <Step number="2" title="مشاركة المدرس" description="يقوم المدرسين بتسجيل الدخول لإدارة ملفاتهم الشخصية، إنشاء الامتحانات، وتحديث درجات الطلاب." />
            <Step number="3" title="مراقبة الوالدين" description="يمكن للوالدين تسجيل الدخول بأمان لعرض أداء أطفالهم والبقاء على اطلاع." />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ماذا يقول مستخدمونا
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              آراء حقيقية من المعلمين والوالدين الذين يحبون إيدورا.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard quote="لقد غيرت إيدورا طريقة إدارة مدرستنا. إنها بديهية وقوية ووفرت لنا ساعات عديدة." author="السيد أحمد" role="مدير" />
            <TestimonialCard quote="كمدرس، أجد المنصة مفيدة جداً في تتبع تقدم طلابي والتواصل مع الوالدين." author="السيدة فاطمة" role="مدرسة" />
            <TestimonialCard quote="بوابة الوالدين رائعة! يمكنني التحقق بسهولة من درجات ابني والحضور من أي مكان." author="علي حسن" role="والد" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            جاهز لتحويل مدرستك؟
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            انضم إلى آلاف المعلمين الذين يثقون بإيدورا لإدارة مؤسساتهم.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-transform transform hover:scale-105"
          >
            <ArrowRight className="mr-2 h-5 w-5" />
            ابدأ اليوم
          </Link>
        </div>
      </section>

    </div>
  );
};

// Helper components for cleaner structure

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow transform hover:-translate-y-2">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Step: React.FC<{ number: string; title: string; description: string }> = ({ number, title, description }) => (
  <div>
    <div className="flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-full mx-auto mb-6">
      <span className="text-2xl font-bold">{number}</span>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const TestimonialCard: React.FC<{ quote: string; author: string; role: string }> = ({ quote, author, role }) => (
  <div className="bg-white rounded-xl shadow-lg p-8">
    <MessageSquare className="h-8 w-8 text-blue-500 mb-4" />
    <p className="text-gray-600 mb-6">"{quote}"</p>
    <div>
      <p className="font-semibold text-gray-900">{author}</p>
      <p className="text-sm text-gray-500">{role}</p>
    </div>
  </div>
);

export default Home;
