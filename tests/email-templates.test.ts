import { describe, it, expect } from 'vitest';
import {
  renderAdminNotificationHtml,
  renderStudentAcknowledgmentHtml,
  EnquiryEmailData,
} from '@/lib/email';

describe('Email Notification Templates', () => {
  const sampleData: EnquiryEmailData = {
    enquiryId: 'test-uuid-1234',
    referenceNumber: 'ASH-202611-X7P2',
    studentName: 'Sanjay Krishnan',
    email: 'sanjay@psgtech.ac.in',
    phone: '+919876501234',
    college: 'PSG College of Technology',
    department: 'ECE',
    domain: 'Internet of Things',
    service: 'Hardware, Embedded & IoT',
    approxBudget: '₹10,000+ (Complex IoT / Embedded)',
    expectedDeadline: new Date('2026-12-30'),
    description: 'Developing an edge computing gateway with ESP32 and LoRaWAN for agricultural soil sensing.',
    attachmentName: 'psg_iot_architecture.pdf',
  };

  it('renders admin notification HTML with all mandatory business fields and reference ID', () => {
    const html = renderAdminNotificationHtml(sampleData);

    expect(html).toContain('ASH-202611-X7P2');
    expect(html).toContain('Sanjay Krishnan');
    expect(html).toContain('sanjay@psgtech.ac.in');
    expect(html).toContain('+919876501234');
    expect(html).toContain('PSG College of Technology');
    expect(html).toContain('Internet of Things');
    expect(html).toContain('psg_iot_architecture.pdf');
    expect(html).toContain('Developing an edge computing gateway');
    expect(html).toContain('2026-12-30');
  });

  it('renders student acknowledgment HTML with reference number and 24-hour SLA promise', () => {
    const html = renderStudentAcknowledgmentHtml(sampleData);

    expect(html).toContain('Dear Sanjay Krishnan');
    expect(html).toContain('ASH-202611-X7P2');
    expect(html).toContain('Guaranteed Review Within 24 Hours');
    expect(html).toContain('@Ashkri_Technologies');
    expect(html).toContain('+919876501234');
    expect(html).toContain('Academic Confidentiality');
  });
});
