import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Veiculos } from '../../models/veiculos.model'

@Component({
  selector: 'app-editor-veiculo',
  templateUrl: './editor-veiculo.component.html',
  styleUrls: ['./editor-veiculo.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditorVeiculoComponent implements OnInit {

  @Input() veiculo: any = null
  @Input() isOpen: boolean = false
  @Output() close = new EventEmitter<void>()
  @Output() save = new EventEmitter<{ veiculo: Veiculos, acao: 'Add' | 'Edit' }>()

  public form: FormGroup
  public anoAtual = new Date().getFullYear()

  constructor(private fb: FormBuilder) {
    this.form = this.criarFormulario()
  }

  ngOnInit() { }

  ngOnChanges(changes: any) {
    if (changes?.isOpen?.currentValue) {
      this.form = this.criarFormulario()
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched() // Força a exibição dos erros
      return
    }
    const veiculo = this.form.value
    veiculo['id'] = !this.veiculo ? Math.floor(1000 + Math.random() * 9000) : this.veiculo.id //TODO: Remover depois
    this.save.emit({ veiculo, acao: this.veiculo ? 'Edit' : 'Add' })
  }

  fechar() {
    this.close.emit()
  }

  private criarFormulario(): FormGroup {
    return this.fb.group({
      placa: [this.veiculo?.placa || '', [Validators.required, Validators.pattern(/^[A-Z]{3}-?\d{4}$/)]],
      renavam: [this.veiculo?.renavam || '', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      modelo: [this.veiculo?.modelo || '', Validators.required],
      marca: [this.veiculo?.marca || '', Validators.required],
      ano: [this.veiculo?.ano ?? null, [Validators.required, Validators.min(1900), Validators.max(this.anoAtual)]],
      motor: [this.veiculo?.motor || '', Validators.required],
      vistoriaEntrada: [this.veiculo?.vistoriaEntrada ?? false],
      vistoriaSaida: [this.veiculo?.vistoriaSaida ?? false],
      situacao: [this.veiculo?.situacao || 'Estoque/SemDoc', Validators.required],
      descricao: [this.veiculo?.descricao || '']
    });
  }

}
