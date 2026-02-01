import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Vì sao giá sản phẩm cao hơn?",
    answer:
      "Vải Thanh Hà là vùng đất đặc biệt, cho chất lượng vải ngon nhất. Vải đầu mùa rất đắt, chủ yếu dùng để xuất khẩu. Chúng tôi ứng dụng công nghệ Nhật Bản (GS Masatoshi Ozaki) với tiêu chí 3 KHÔNG: Không thêm nước – Không thêm đường – Không chất bảo quản. Sản phẩm có thể bảo quản 1 năm ở nhiệt độ thường, đã được kiểm nghiệm tại Nhật. Quy trình sản xuất nghiêm ngặt, do người Nhật giám sát.",
  },
  {
    question: "Có đường hóa học không?",
    answer:
      "Không. Vị ngọt hoàn toàn tự nhiên từ quả vải.",
  },
  {
    question: "Có thêm nước không?",
    answer:
      "Không. Nước trong sản phẩm là nước tự nhiên ép từ thịt vải.",
  },
  {
    question: "Loại nào ngon nhất?",
    answer:
      "Mỗi loại đều ngon theo cách riêng. Khác nhau về thời gian chín, hương vị và hình thức.",
  },
  {
    question: "Vì sao giá các loại khác nhau?",
    answer:
      "Do độ hiếm, thời điểm thu hoạch và mức độ ưa chuộng tại nước ngoài. Nhiều loại ít bán tại Việt Nam, chưa phổ biến.",
  },
  {
    question: "Vải MIX (phối trộn) là gì?",
    answer:
      "Công thức nghiên cứu riêng của công ty. Kết hợp hài hòa hương vị đặc trưng của nhiều loại vải.",
  },
  {
    question: "Vải nào ngọt nhất?",
    answer:
      "Tùy cảm nhận của từng khách hàng, chúng tôi sẽ tư vấn theo khẩu vị của bạn.",
  },
  {
    question: "Trẻ em có dùng được không?",
    answer:
      "Hoàn toàn dùng được. Sản phẩm tự nhiên, tốt cho sức khỏe, cung cấp vitamin thiết yếu.",
  },
  {
    question: "Phụ nữ mang thai dùng được không?",
    answer:
      "Theo nghiên cứu, axit folic tự nhiên trong vải rất tốt cho bà bầu.",
  },
  {
    question: "Cách bảo quản và sử dụng?",
    answer:
      "Chưa mở nắp: bảo quản nhiệt độ thường. Đã mở nắp: dùng trong ngày. Ngon hơn khi uống lạnh, lắc đều trước khi dùng.",
  },
  {
    question: "Có xuất hóa đơn VAT không?",
    answer:
      "Có, chúng tôi xuất hóa đơn VAT theo yêu cầu của khách hàng.",
  },
  {
    question: "Phí vận chuyển như thế nào?",
    answer:
      "Đơn hàng từ 2 triệu đồng: miễn phí vận chuyển.",
  },
  {
    question: "Có thể pha trộn với nguyên liệu khác không?",
    answer:
      "Có thể pha với chanh hoặc các nguyên liệu khác theo sở thích của bạn.",
  },
]

export function FAQAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full space-y-2">
      {faqs.map((faq, index) => (
        <AccordionItem 
          key={index} 
          value={`item-${index}`}
          className="border rounded-lg px-4 hover:bg-muted/50 transition-colors"
        >
          <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
            {faq.question}
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

