import { CommonModule } from '@angular/common'
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ContentChild } from '@angular/core'
import { FormsModule } from '@angular/forms'
@Component({
  selector: 'app-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class DatagridComponent implements OnInit {

  @Input() dataSource: any[] = []
  @Input() isCRUD: boolean = true
  @Input() isInputSearch: boolean = true
  @Input() isButtonTask: boolean = false
  @Input() columns: { key: string; header: string, tipo: 'string' | 'booleano' | 'number', cores?: any }[] = []
  @Output() add = new EventEmitter<void>()
  @Output() edit = new EventEmitter<any>()
  @Output() delete = new EventEmitter<any>()
  @Output() tarefa = new EventEmitter<number>()
  @ContentChild('detailTemplate') detailTemplate: TemplateRef<any> | null = null

  globalSearch = ''
  currentPage = 1
  itemsPerPage = 5
  pageSize: number = 10
  totalRecords: number = 0
  expandedRows: boolean[] = []
  sortColumn: string = ""
  sortDirection: "asc" | "desc" = "asc"
  isOpenPopupConfimacao: boolean = false

  private registroParaExcluir: any = null

  constructor() { }

  ngOnInit() { }

  // Função para filtrar os dados
  get filteredData() {
    if (!this.globalSearch) {
      return this.dataSource // Retorna todos os dados se não houver pesquisa
    }
    const searchTerm = this.globalSearch.toLowerCase()
    return this.dataSource.filter((item) => {
      return this.columns.some((column) => {
        const value = item[column.key]?.toString().toLowerCase()
        return value.includes(searchTerm)
      })
    })
  }

  // Função para calcular os dados paginados
  get paginatedData() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return this.filteredData.slice(startIndex, endIndex)
  }

  changePage(page: number) {
    this.currentPage = page
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage)
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  toggleDetail(index: number) {
    this.expandedRows[index] = !this.expandedRows[index]
  }

  abrirModalConfimacao(item: any) {
    this.registroParaExcluir = item
    this.isOpenPopupConfimacao = true
  }

  deletarRegistro(): void {
    this.delete.emit(this.registroParaExcluir)
    this.isOpenPopupConfimacao = false
  }

  cancelarExclusao(): void {
    this.registroParaExcluir = null
    this.isOpenPopupConfimacao = false
  }

  sortByColumn(column: any) {
    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
    } else {
      this.sortColumn = column.key;
      this.sortDirection = "asc"
    }
    this.paginatedData.sort((a, b) => {
      const valueA = a[this.sortColumn]
      const valueB = b[this.sortColumn]
      if (typeof valueA === "number" && typeof valueB === "number") {
        return this.sortDirection === "asc" ? valueA - valueB : valueB - valueA
      }
      return this.sortDirection === "asc"
        ? valueA.toString().localeCompare(valueB.toString())
        : valueB.toString().localeCompare(valueA.toString())
    })
  }

  getSortIcon(column: any) { //TODO: Virar pipe
    if (this.sortColumn !== column.key) return "fa-sort"
    return this.sortDirection === "asc" ? "fa-sort-up" : "fa-sort-down"
  }

  getCellStyle(value: string, cores: any) { //TODO: Virar pipe
    return cores[value] ? { color: cores[value], fontWeight: 'bold' } : {}
  }
}
